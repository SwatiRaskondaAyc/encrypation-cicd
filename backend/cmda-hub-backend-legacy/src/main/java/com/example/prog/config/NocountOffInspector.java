package com.example.prog.config;

import org.hibernate.resource.jdbc.spi.StatementInspector;

public class NocountOffInspector implements StatementInspector {
    @Override
    public String inspect(String sql) {
        if (sql.toLowerCase().startsWith("insert")) {
            return "SET NOCOUNT OFF; " + sql;
        }
        return sql;
    }
}