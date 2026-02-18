package com.example.prog.portfolio.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.prog.entity.portfolio.UserPortfolioUploads;
import com.example.prog.repository.portfolioRepo.UserPortfolioUploadRepository;
import com.example.prog.repository.portfolioRepo.TradeFileRecordHashRepository;

@Service
public class DeletePortfolioTableService {

	@Autowired
    @Qualifier("portfolioJdbcTemplate")
    private JdbcTemplate portfolioJdbcTemplate;
    
	@Autowired
    @Qualifier("resultJdbcTemplate")  // defined for CMDA_portf_Result
    private JdbcTemplate resultJdbcTemplate;
	
	@Autowired
	private UserPortfolioUploadRepository userPortfolioUploadRepository;

	@Autowired
    private TradeFileRecordHashRepository tradeFileRecordHashRepository;


	// public boolean deletePortfolioTable(String uploadId) throws IllegalArgumentException {
	//     try {
	//         UserPortfolioUploads uploads = userPortfolioUploadRepository.findByUploadId(uploadId)
	//                 .orElseThrow(() -> new RuntimeException("Upload not found with ID: " + uploadId));

	//         String portfolioTableName = uploads.getPortfolioTableName();

	//         if (portfolioTableName.contains("#")) {
	//             System.out.println("Skipping deletion. Table name contains '#': " + portfolioTableName);
	//             return false;
	//         }

	//         if (!portfolioTableName.matches("^[a-zA-Z0-9_]+$")) {
	//             throw new IllegalArgumentException("Invalid portfolio table name: " + portfolioTableName);
	//         }

	//         String prefix = uploads.getUserType().equalsIgnoreCase("corporate") ? "Corporate" : "user";
	//         String sanitizedPlatform = uploads.getPlatform().replaceAll("\\s+", "");
	//         String baseTableName = prefix + uploads.getUserID() + "_" + sanitizedPlatform;

	//         String resultTableName = baseTableName + "_portfolio_results";
	//         String transactionTableName = baseTableName + "_transcation";

	//         // Delete tables (each wrapped in try-catch to ensure others still run)
	//         deleteTableIfExists(portfolioTableName, portfolioJdbcTemplate);
	//         deleteTableIfExists(resultTableName, resultJdbcTemplate);
	//         deleteTableIfExists(transactionTableName, resultJdbcTemplate);

	//         // Delete upload record
	//         userPortfolioUploadRepository.delete(uploads);
	        
	//         return true;

	//     } catch (RuntimeException e) {
	//         System.err.println("Validation or business error: " + e.getMessage());
	//         return false;

	//     } catch (Exception e) {
	//         System.err.println("Unexpected error during deletion: " + e.getMessage());
	//         e.printStackTrace(); 
	//         return false;
	//     }
	// }

	@Transactional(transactionManager = "userTransactionManager")
	public boolean deletePortfolioTable(String uploadId) throws IllegalArgumentException {
	    try {
	        UserPortfolioUploads uploads = userPortfolioUploadRepository.findByUploadId(uploadId)
	                .orElseThrow(() -> new RuntimeException("Upload not found with ID: " + uploadId));

	        String portfolioTableName = uploads.getPortfolioTableName();

	        if (portfolioTableName.contains("#")) {
	            System.out.println("Skipping deletion. Table name contains '#': " + portfolioTableName);
	            return false;
	        }

	        if (!portfolioTableName.matches("^[a-zA-Z0-9_]+$")) {
	            throw new IllegalArgumentException("Invalid portfolio table name: " + portfolioTableName);
	        }

	        String prefix = uploads.getUserType().equalsIgnoreCase("corporate") ? "Corporate" : "user";
	        String sanitizedPlatform = uploads.getPlatform().replaceAll("\\s+", "");
	        String baseTableName = prefix + uploads.getUserID() + "_" + sanitizedPlatform;

	        String resultTableName = baseTableName + "_portfolio_results";
	        String transactionTableName = baseTableName + "_transcation";

	        // Delete tables (each wrapped in try-catch to ensure others still run)
	        deleteTableIfExists(portfolioTableName, portfolioJdbcTemplate);
	        deleteTableIfExists(resultTableName, resultJdbcTemplate);
	        deleteTableIfExists(transactionTableName, resultJdbcTemplate);
	        
	        
	        // Delete upload record
	        userPortfolioUploadRepository.delete(uploads);
	        //new added 
	        tradeFileRecordHashRepository.deleteByUploadId(uploadId);
	        
	        return true;

	    } catch (RuntimeException e) {
	        System.err.println("Validation or business error: " + e.getMessage());
	        return false;

	    } catch (Exception e) {
	        System.err.println("Unexpected error during deletion: " + e.getMessage());
	        e.printStackTrace(); 
	        return false;
	    }
	}

	private void deleteTableIfExists(String tableName, JdbcTemplate jdbcTemplate) {
	    if (!tableName.matches("^[a-zA-Z0-9_]+$")) {
	        System.out.println("Skipping invalid table name: " + tableName);
	        return;
	    }

	    String sql = String.format(
	            "IF OBJECT_ID('%s', 'U') IS NOT NULL DROP TABLE [%s]",
	            tableName, tableName);

	    try {
	        jdbcTemplate.execute(sql);
	        System.out.println("Deleted table: " + tableName);
	    } catch (Exception e) {
	        System.err.println("Error deleting table: " + tableName + " -> " + e.getMessage());
	        
	    }
	}


}


