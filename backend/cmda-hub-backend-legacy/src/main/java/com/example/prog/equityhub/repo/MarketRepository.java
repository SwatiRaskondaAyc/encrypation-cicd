package com.example.prog.equityhub.repo;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class MarketRepository {

    private final JdbcTemplate jdbcTemplate;

    public MarketRepository(@Qualifier("marketJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> findTopCompanyByClosePrice() {
        String sql =  """
                SELECT TOP 1 CompanyName, Symbol
                FROM [CMDA_MktDB].[dbo].[Daily_Top10_PA]
                ORDER BY [Close] DESC
                """;

        return jdbcTemplate.queryForMap(sql);
    }
}
