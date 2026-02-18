package com.example.prog.repository.mconsole;

import com.example.prog.entity.UserDtls;
import com.example.prog.entity.CorporateUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class MconsoleRepositoryImpl implements MconsoleRepository {

    private static final Logger logger = LoggerFactory.getLogger(MconsoleRepositoryImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public long countActiveIndividualUsers() {
        Query query = entityManager.createQuery(
            "SELECT COUNT(u) FROM UserDtls u WHERE u.status = 1");
        long count = (Long) query.getSingleResult();
        logger.debug("countActiveIndividualUsers: {}", count);
        return count;
    }

    @Override
    public long countActiveCorporateUsers() {
        Query query = entityManager.createQuery(
            "SELECT COUNT(u) FROM CorporateUser u WHERE u.status = 1");
        long count = (Long) query.getSingleResult();
        logger.debug("countActiveCorporateUsers: {}", count);
        return count;
    }

    @Override
    public long countInactiveIndividualUsers() {
        Query query = entityManager.createQuery(
            "SELECT COUNT(u) FROM UserDtls u WHERE u.status = 0");
        long count = (Long) query.getSingleResult();
        logger.debug("countInactiveIndividualUsers: {}", count);
        return count;
    }

    @Override
    public long countInactiveCorporateUsers() {
        Query query = entityManager.createQuery(
            "SELECT COUNT(u) FROM CorporateUser u WHERE u.status = 0");
        long count = (Long) query.getSingleResult();
        logger.debug("countInactiveCorporateUsers: {}", count);
        return count;
    }

    @Override
    public long countRegisteredIndividualUsers() {
        Query query = entityManager.createQuery(
            "SELECT COUNT(u) FROM UserDtls u");
        long count = (Long) query.getSingleResult();
        logger.debug("countRegisteredIndividualUsers: {}", count);
        return count;
    }

    @Override
    public long countRegisteredCorporateUsers() {
        Query query = entityManager.createQuery(
            "SELECT COUNT(u) FROM CorporateUser u");
        long count = (Long) query.getSingleResult();
        logger.debug("countRegisteredCorporateUsers: {}", count);
        return count;
    }

    @Override
    public UserDtls findIndividualByEmail(String email) {
        try {
            Query query = entityManager.createQuery(
                "SELECT u FROM UserDtls u WHERE u.email = :email");
            query.setParameter("email", email);
            UserDtls user = (UserDtls) query.getSingleResult();
            logger.debug("findIndividualByEmail: {} found for email: {}", user, email);
            return user;
        } catch (NoResultException e) {
            logger.debug("findIndividualByEmail: No user found for email: {}", email);
            return null;
        }
    }

    @Override
    public CorporateUser findCorporateByEmail(String email) {
        try {
            Query query = entityManager.createQuery(
                "SELECT u FROM CorporateUser u WHERE u.email = :email");
            query.setParameter("email", email);
            CorporateUser user = (CorporateUser) query.getSingleResult();
            logger.debug("findCorporateByEmail: {} found for email: {}", user, email);
            return user;
        } catch (NoResultException e) {
            logger.debug("findCorporateByEmail: No user found for email: {}", email);
            return null;
        }
    }
}