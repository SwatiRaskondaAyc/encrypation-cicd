package com.example.prog.indices.controller;


// import com.example.prog.indices.service.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/indices")
// public class IndexController {

//     @Autowired
//     private IndexService indexService;

//     // Map short names -> actual index names used by Python microservice
//     private static final Map<String, String> INDEX_MAP = Map.ofEntries(
//             Map.entry("nifty50", "NIFTY 50"),
//             Map.entry("niftynext50", "NIFTY NEXT 50"),
//             Map.entry("niftybank", "NIFTY BANK"),
//             Map.entry("niftymidcap100", "NIFTY MIDCAP 100"),
//             Map.entry("niftysmallcap250", "NIFTY SMALLCAP 250"),
//             Map.entry("niftyalpha50", "NIFTY ALPHA 50"),
//             Map.entry("nifty100quality30", "NIFTY100 QUALITY 30"),
//             Map.entry("nifty50value20", "NIFTY 50 VALUE 20"),
//             Map.entry("nifty100lowvol30", "NIFTY 100 LOW VOL. 30"),
//             Map.entry("niftycpse", "NIFTY CPSE")
//     );

//     @GetMapping("/{indexKey}")
//     public ResponseEntity<String> getIndex(@PathVariable String indexKey) {
//         String indexName = INDEX_MAP.get(indexKey.toLowerCase());
//         if (indexName == null) {
//             return ResponseEntity.badRequest().body("Invalid index name: " + indexKey);
//         }
//         return ResponseEntity.ok(indexService.getIndexData(indexName));
//     }
// }


import com.example.prog.indices.config.IndicesProperties;
import com.example.prog.indices.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/indices")
public class IndexController {

    @Autowired
    private IndexService indexService;

    @Autowired
    private IndicesProperties indicesProperties;

    // Accepts index_name as query param from frontend
    @GetMapping
    public ResponseEntity<String> getIndex(@RequestParam("name") String indexName) {
        if (!indicesProperties.getAllowed().contains(indexName)) {
            return ResponseEntity.badRequest().body("Invalid index name: " + indexName);
        }
        try {
            return ResponseEntity.ok(indexService.getIndexData(indexName));
        } catch (Exception e) {
            // Keep response shape aligned with frontend expectations (status/message/data).
            String json = "{\"status\":\"error\",\"message\":\"Failed to load index data\",\"data\":null}";
            return ResponseEntity.status(502).body(json);
        }
    }
}


