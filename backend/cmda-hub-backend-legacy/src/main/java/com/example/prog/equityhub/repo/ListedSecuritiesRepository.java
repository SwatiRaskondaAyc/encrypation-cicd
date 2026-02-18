// package com.example.prog.equityhub.repo;

// import java.util.List;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;
// import com.example.prog.equityhub.entity.ListedSecurities;

// @Repository
// public interface ListedSecuritiesRepository extends JpaRepository<ListedSecurities, String> {
    
//     @Query(value = "SELECT l.Symbol, l.CompanyName, i.Basic_Industry " +
//            "FROM dbo.ListedSecurities l " +
//            "LEFT JOIN dbo.IndustryStructure i ON l.Basic_Ind_code = i.Basic_Ind_Code " +
//            "WHERE LOWER(l.CompanyName) LIKE LOWER(:prefix) + '%' " +
//            "OR LOWER(l.Symbol) LIKE LOWER(:prefix) + '%' " +
//            "ORDER BY l.CompanyName " +
//            "OFFSET 0 ROWS FETCH NEXT :limit ROWS ONLY", 
//            nativeQuery = true)
//     List<Object[]> findCompaniesByPrefix(@Param("prefix") String prefix, @Param("limit") int limit);
    
//     @Query("SELECT DISTINCT h.symbol, l.companyName, i.basicIndustry " +
//            "FROM HistPA h " +
//            "LEFT JOIN ListedSecurities l ON l.symbol = h.symbol " +
//            "JOIN IndustryStructure i ON i.basicIndCode = l.basicIndCode " +
//            "WHERE UPPER(h.symbol) LIKE CONCAT(UPPER(:query), '%') " +
//            "OR UPPER(l.companyName) LIKE CONCAT(UPPER(:query), '%')")
//     Page<Object[]> findBySymbolOrCompanyName(@Param("query") String query, Pageable pageable);
// }

package com.example.prog.equityhub.repo;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.prog.equityhub.entity.ListedSecurities;

@Repository
public interface ListedSecuritiesRepository extends JpaRepository<ListedSecurities, String> {
    // The queries can remain but are no longer used in the service for search/suggestions.
    // If not needed elsewhere, they can be commented out.

//     @Query(value = "SELECT DISTINCT l.Symbol, l.CompanyName, i.Basic_Industry " +
//            "FROM dbo.ListedSecurities l " +
//            "LEFT JOIN dbo.IndustryStructure i ON l.Basic_Ind_code = i.Basic_Ind_Code " +
//            "WHERE LOWER(l.CompanyName) LIKE LOWER(:prefix) + '%' " +
//            "OR LOWER(l.Symbol) LIKE LOWER(:prefix) + '%' " +
//            "UNION " +
//            "SELECT DISTINCT h.symbol AS Symbol, l.companyName AS CompanyName, i.Basic_Industry " +
//            "FROM dbo.HistPA h " +
//            "LEFT JOIN dbo.ListedSecurities l ON l.symbol = h.symbol " +
//            "JOIN dbo.IndustryStructure i ON i.Basic_Ind_Code = l.Basic_Ind_Code " +
//            "WHERE UPPER(h.symbol) LIKE UPPER(:prefix) + '%' " +
//            "OR UPPER(l.companyName) LIKE UPPER(:prefix) + '%' " +
//            "ORDER BY CompanyName " +
//            "OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY", 
//            nativeQuery = true)
//     List<Object[]> findCompaniesByPrefix(@Param("prefix") String prefix, @Param("offset") int offset, @Param("limit") int limit);
    
//     @Query("SELECT DISTINCT h.symbol, l.companyName, i.basicIndustry " +
//            "FROM HistPA h " +
//            "LEFT JOIN ListedSecurities l ON l.symbol = h.symbol " +
//            "JOIN IndustryStructure i ON i.basicIndCode = l.basicIndCode " +
//            "WHERE UPPER(h.symbol) LIKE CONCAT(UPPER(:query), '%') " +
//            "OR UPPER(l.companyName) LIKE CONCAT(UPPER(:query), '%')")
//     Page<Object[]> findBySymbolOrCompanyName(@Param("query") String query, Pageable pageable);
}
