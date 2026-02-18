package com.example.prog.new_portfolio.services;

import com.example.prog.entity.new_portfolio.MasterUserLedger;
import com.example.prog.new_portfolio.dto.TradeTransactionDTO;
import com.example.prog.new_portfolio.dto.UserContext;
import com.example.prog.repository.new_portfolio.MasterUserLedgerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PortfolioOrchestratorService {

    private final MasterUserLedgerRepository masterRepository;
    private final PortfolioDataPersistenceService dataPersistenceService;
    private final PortfolioSchemaService schemaService;

    public PortfolioOrchestratorService(MasterUserLedgerRepository masterRepo,
                                        PortfolioDataPersistenceService dataService,
                                        PortfolioSchemaService schemaService) {
        this.masterRepository = masterRepo;
        this.dataPersistenceService = dataService;
        this.schemaService = schemaService;
    }

    @Transactional(value = "globalTransactionManager", rollbackFor = Exception.class)
    public void processAndSavePortfolio(UserContext user, String tableName, String portfolioId,
                                        String portfolioName, String brokerId,
                                        List<TradeTransactionDTO> fileTrades) {

        String userIdStr = String.valueOf(user.getUserId());

        // 1. Validation Logic inside Transaction
        Optional<MasterUserLedger> existingEntry = masterRepository.findByUserIdAndPid(userIdStr, portfolioId);

        if (existingEntry.isPresent()) {
            String existingBrokerId = existingEntry.get().getBrokerId();
            if (existingBrokerId != null && !existingBrokerId.equalsIgnoreCase(brokerId)) {
                throw new IllegalStateException("Broker mismatch. Expected: " + existingBrokerId);
            }
        } else {
            if (masterRepository.countByUserId(userIdStr) >= 5) {
                throw new RuntimeException("Portfolio limit exceeded (Max 5).");
            }
        }

        // 2. Prepare Ledger Entity
        MasterUserLedger ledger = existingEntry.orElse(new MasterUserLedger());
        if (existingEntry.isEmpty()) {
            ledger.setUserId(userIdStr);
            ledger.setPid(portfolioId);
            ledger.setPortfolioTableName(tableName);
            ledger.setUserType(user.getUserType());
            ledger.setBrokerId(brokerId);
        }
        ledger.setPortfolioName(portfolioName != null ? portfolioName : portfolioId);
        ledger.setUploadedAt(LocalDateTime.now());
        ledger.setUploadId(UUID.randomUUID().toString());

        // 3. Sequential DB Updates
        // A. Create table (Physical Data DB)
        schemaService.createPortfolioTable(tableName);

        // B. Insert Trades (Physical Data DB)
        dataPersistenceService.insertTrades(tableName, portfolioId, brokerId, fileTrades);

        // C. Update Registry (Master Registry DB)
        masterRepository.save(ledger);

        // ChainedTransactionManager ensures A, B, and C are atomic.
    }

    @Transactional(value = "globalTransactionManager", rollbackFor = Exception.class)
    public void deleteEntirePortfolio(String userId, String portfolioId, String tableName) {
        // 1. Remove trades from dynamic table
        dataPersistenceService.deleteAllTrades(tableName, portfolioId);

        // 2. Remove registry entry
        masterRepository.deleteByUserIdAndPid(userId, portfolioId);
    }
}