//package com.example.prog.repository.mconsole;
//
//import com.example.prog.entity.UserDtls;
//import com.example.prog.entity.CorporateUser;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//public interface MconsoleRepository extends JpaRepository<Object, Long> {
//
//    @Query("SELECT COUNT(u) FROM UserDtls u WHERE UPPER(u.userType) = 'INDIVIDUAL' AND u.status = 1")
//    long countActiveIndividualUsers();
//
//    @Query("SELECT COUNT(u) FROM CorporateUser u WHERE UPPER(u.userType) = 'CORPORATE' AND u.status = 1")
//    long countActiveCorporateUsers();
//
//    @Query("SELECT COUNT(u) FROM UserDtls u WHERE UPPER(u.userType) = 'INDIVIDUAL' AND u.status = 0")
//    long countInactiveIndividualUsers();
//
//    @Query("SELECT COUNT(u) FROM CorporateUser u WHERE UPPER(u.userType) = 'CORPORATE' AND u.status = 0")
//    long countInactiveCorporateUsers();
//
//    @Query("SELECT COUNT(u) FROM UserDtls u WHERE UPPER(u.userType) = 'INDIVIDUAL'")
//    long countRegisteredIndividualUsers();
//
//    @Query("SELECT COUNT(u) FROM CorporateUser u WHERE UPPER(u.userType) = 'CORPORATE'")
//    long countRegisteredCorporateUsers();
//
//    @Query("SELECT u FROM UserDtls u WHERE u.email = :email")
//    UserDtls findIndividualByEmail(@Param("email") String email);
//
//    @Query("SELECT u FROM CorporateUser u WHERE u.email = :email")
//    CorporateUser findCorporateByEmail(@Param("email") String email);
//}

package com.example.prog.repository.mconsole;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.CorporateUser;
import org.springframework.stereotype.Repository;

@Repository
public interface MconsoleRepository {
    long countActiveIndividualUsers();
    long countActiveCorporateUsers();
    long countInactiveIndividualUsers();
    long countInactiveCorporateUsers();
    long countRegisteredIndividualUsers();
    long countRegisteredCorporateUsers();
    UserDtls findIndividualByEmail(String email);
    CorporateUser findCorporateByEmail(String email);
}