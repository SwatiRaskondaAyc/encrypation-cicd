// package com.example.prog.token;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;

// @Component
// public class JwtUtil {

//     // 🔐 Shared constant key for both Google and Normal login (must be 32+ characters)
//     private static final String SECRET = "your-256-bit-secret-your-256-bit-secret";
//     private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

//     // 🔒 1 day expiration
//     public static final long EXPIRATION_TIME = 86400000;

//     // ✅ Generate token for normal login (only subject/email)
//     public static String generateToken(String email) {
//         return Jwts.builder()
//                 .setClaims(new HashMap<>())
//                 .setSubject(email)
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     // ✅ Generate token for Google login (with extra claims)
//     public static String generateToken(String userId, String email, String name, String userType) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("email", email);
//         claims.put("name", name);
//         claims.put("userType", userType);

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(userId)  // or email, depending on what you want as unique id
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     // ✅ Extract email from any token type (Google or normal login)
//     public static String extractEmail(String token) {
//         Claims claims = getClaimsFromToken(token);
//         String email = claims.get("email", String.class);
//         return (email != null) ? email : claims.getSubject();
//     }

//     // ✅ Extract userType (only exists in Google tokens)
//     public static String extractUserType(String token) {
//         return getClaimsFromToken(token).get("userType", String.class);
//     }

//     // ✅ Extract name (only exists in Google tokens)
//     public static String extractName(String token) {
//         return getClaimsFromToken(token).get("name", String.class);
//     }

//     // ✅ Extract userId or subject
//     public static String extractUserId(String token) {
//         return getClaimsFromToken(token).getSubject();
//     }

//     // ✅ Validate token using email
//     public static boolean validateToken(String token, String email) {
//         String extractedEmail = extractEmail(token);
//         return email.equals(extractedEmail) && !isTokenExpired(token);
//     }

//     // ✅ Validate only token structure and expiration
//     public static boolean validateToken(String token) {
//         try {
//             getClaimsFromToken(token); // will throw if invalid
//             return true;
//         } catch (Exception e) {
//             return false;
//         }
//     }

//     // ✅ Check if token is expired
//     private static boolean isTokenExpired(String token) {
//         Date expiration = getClaimsFromToken(token).getExpiration();
//         return expiration.before(new Date());
//     }

//     // ✅ Internal method to parse token and get claims
//     public static Claims getClaimsFromToken(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(SECRET_KEY)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
// }


// Management Console Code 

// package com.example.prog.token;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import jakarta.annotation.PostConstruct;
// import java.nio.charset.StandardCharsets;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.List;

// @Component
// public class JwtUtil {

//     @Value("${jwt.secret}")
//     private String secret;

//     // Initialize SECRET_KEY as a non-final field and set it in @PostConstruct
//     private SecretKey SECRET_KEY;

//     // 🔒 1 day expiration
//     public static final long EXPIRATION_TIME = 86400000;

//     @PostConstruct
//     public void init() {
//         this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
//     }

//     // ✅ Generate token for normal login (only subject/email)
//     @SuppressWarnings("deprecation")
//     public String generateToken(String email) {
//         return Jwts.builder()
//                 .setClaims(new HashMap<>())
//                 .setSubject(email)
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     // ✅ Generate token for Google login (with extra claims)
//     public String generateToken(String userId, String email, String name, String userType) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("email", email);
//         claims.put("name", name);
//         claims.put("userType", userType);

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(userId)  // or email, depending on what you want as unique id
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     public String generateToken(String email, String userType, List<String> roles) {
//     Map<String, Object> claims = new HashMap<>();
//     claims.put("email", email);
//     claims.put("userType", userType);
//     claims.put("roles", roles);
//     return Jwts.builder()
//             .setClaims(claims)
//             .setSubject(email)
//             .setIssuedAt(new Date())
//             .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//             .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//             .compact();
// }

//     @SuppressWarnings("unchecked")
//     public List<String> extractRoles(String token) {
//         return (List<String>) Jwts.parserBuilder()
//                 .setSigningKey(SECRET_KEY)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .get("roles");
//     }

//     // ✅ Extract email from any token type (Google or normal login)
//     public String extractEmail(String token) {
//         Claims claims = getClaimsFromToken(token);
//         String email = claims.get("email", String.class);
//         return (email != null) ? email : claims.getSubject();
//     }

//     // ✅ Extract userType (only exists in Google tokens)
//     public String extractUserType(String token) {
//         return getClaimsFromToken(token).get("userType", String.class);
//     }

//     // ✅ Extract name (only exists in Google tokens)
//     public String extractName(String token) {
//         return getClaimsFromToken(token).get("name", String.class);
//     }

//     // ✅ Validate token using email
//     public boolean validateToken(String token, String email) {
//         String extractedEmail = extractEmail(token);
//         return email.equals(extractedEmail) && !isTokenExpired(token);
//     }

//     // ✅ Validate only token structure and expiration
//     public boolean validateToken(String token) {
//         try {
//             getClaimsFromToken(token); // will throw if invalid
//             return true;
//         } catch (Exception e) {
//             return false;
//         }
//     }

//     // ✅ Check if token is expired
//     private boolean isTokenExpired(String token) {
//         Date expiration = getClaimsFromToken(token).getExpiration();
//         return expiration.before(new Date());
//     }

//     // ✅ Internal method to parse token and get claims
//     public Claims getClaimsFromToken(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(SECRET_KEY)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
// }


// ------------ before promo code ---------
// package com.example.prog.token;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import jakarta.annotation.PostConstruct;
// import java.nio.charset.StandardCharsets;
// import java.time.Instant;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.List;

// @Component
// public class JwtUtil {

//     @Value("${jwt.secret}")
//     private String secret;

//     // Initialize SECRET_KEY as a non-final field and set it in @PostConstruct
//     private SecretKey SECRET_KEY;

//     // 🔒 1 day expiration
//     public static final long EXPIRATION_TIME = 86400000;

//     @PostConstruct
//     public void init() {
//         this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
//     }

//     // ✅ Generate token for normal login (only subject/email)
//     @SuppressWarnings("deprecation")
//     public String generateToken(String email) {
//         return Jwts.builder()
//                 .setClaims(new HashMap<>())
//                 .setSubject(email)
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     // ✅ Generate token for Google login (with extra claims)
//     public String generateToken(String userId, String email, String name, String userType) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("email", email);
//         claims.put("name", name);
//         claims.put("userType", userType);

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(userId)  // or email, depending on what you want as unique id
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     public String generateToken(String email, String userType, List<String> roles) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("email", email);
//         claims.put("userType", userType);
//         claims.put("roles", roles);
//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(email)
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     @SuppressWarnings("unchecked")
//     public List<String> extractRoles(String token) {
//         return (List<String>) Jwts.parserBuilder()
//                 .setSigningKey(SECRET_KEY)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .get("roles");
//     }

//     // ✅ Extract email from any token type (Google or normal login)
//     public String extractEmail(String token) {
//         Claims claims = getClaimsFromToken(token);
//         String email = claims.get("email", String.class);
//         return (email != null) ? email : claims.getSubject();
//     }

//     // ✅ Extract userType (only exists in Google tokens)
//     public String extractUserType(String token) {
//         return getClaimsFromToken(token).get("userType", String.class);
//     }

//     // ✅ Extract name (only exists in Google tokens)
//     public String extractName(String token) {
//         return getClaimsFromToken(token).get("name", String.class);
//     }

//     // ✅ Validate token using email
//     public boolean validateToken(String token, String email) {
//         String extractedEmail = extractEmail(token);
//         return email.equals(extractedEmail) && !isTokenExpired(token);
//     }

//     // ✅ Validate only token structure and expiration
//     public boolean validateToken(String token) {
//         try {
//             getClaimsFromToken(token); // will throw if invalid
//             return true;
//         } catch (Exception e) {
//             return false;
//         }
//     }

//     // ✅ Check if token is expired
//     private boolean isTokenExpired(String token) {
//         Date expiration = getClaimsFromToken(token).getExpiration();
//         return expiration.before(new Date());
//     }

//     // ✅ Internal method to parse token and get claims
//     public Claims getClaimsFromToken(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(SECRET_KEY)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     // ✅ Get token creation time from the 'iat' claim
//     // public Instant getTokenCreationTime(String token) {
//     //     Claims claims = getClaimsFromToken(token);
//     //     Date issuedAt = claims.getIssuedAt();
//     //     return issuedAt != null ? issuedAt.toInstant() : null;
//     // }

//       public Instant getTokenCreationTime(String token) {
//         Date issuedAt = Jwts.parserBuilder()
//                 .setSigningKey(SECRET_KEY)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getIssuedAt();
//         return issuedAt != null ? issuedAt.toInstant() : null;
//     }
// }


// -------------- promo code Shreya-------------

package com.example.prog.token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // Initialize SECRET_KEY as a non-final field and set it in @PostConstruct
    private SecretKey SECRET_KEY;

    // 🔒 1 day expiration
    public static final long EXPIRATION_TIME = 86400000;

    @PostConstruct
    public void init() {
        this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ✅ Generate token for normal login (only subject/email)
    @SuppressWarnings("deprecation")
    public String generateToken(String email) {
        return Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Generate token for Google login (with extra claims)
    public String generateToken(String userId, String email, String name, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("name", name);
        claims.put("userType", userType);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userId)  // or email, depending on what you want as unique id
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(String email, String userType, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("userType", userType);
        claims.put("roles", roles);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return (List<String>) Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("roles");
    }

    // ✅ Extract email from any token type (Google or normal login)
    public String extractEmail(String token) {
        Claims claims = getClaimsFromToken(token);
        String email = claims.get("email", String.class);
        return (email != null) ? email : claims.getSubject();
    }

    // ✅ Extract userType (only exists in Google tokens)
    public String extractUserType(String token) {
        return getClaimsFromToken(token).get("userType", String.class);
    }

    // ✅ Extract name (only exists in Google tokens)
    public String extractName(String token) {
        return getClaimsFromToken(token).get("name", String.class);
    }

    // ✅ Validate token using email
    public boolean validateToken(String token, String email) {
        String extractedEmail = extractEmail(token);
        return email.equals(extractedEmail) && !isTokenExpired(token);
    }

    // ✅ Validate only token structure and expiration
    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token); // will throw if invalid
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ Check if token is expired
    private boolean isTokenExpired(String token) {
        Date expiration = getClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    // ✅ Internal method to parse token and get claims
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Get token creation time from the 'iat' claim
    // public Instant getTokenCreationTime(String token) {
    //     Claims claims = getClaimsFromToken(token);
    //     Date issuedAt = claims.getIssuedAt();
    //     return issuedAt != null ? issuedAt.toInstant() : null;
    // }

      public Instant getTokenCreationTime(String token) {
        Date issuedAt = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getIssuedAt();
        return issuedAt != null ? issuedAt.toInstant() : null;
    }

    // ---- promo code by shreya ----

    public String generatePendingGoogleToken(String googleUserId, String email, String name, String picture) {
    return Jwts.builder()
            .setSubject(googleUserId)
            .claim("email", email)
            .claim("name", name)
            .claim("picture", picture)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 600000)) // 10 minutes
            .signWith(SignatureAlgorithm.HS512, secret) // Use your secret key
            .compact();
    }

            public boolean validatePendingToken(String token) {
                try {
                    Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            public String extractPendingSubject(String token) {
                return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
            }

            public String extractPendingClaim(String token, String claimKey) {
                Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
                return claims.get(claimKey, String.class);
            }
}