package com.example.prog.service;

import com.example.prog.entity.InvestmentProfile;
import com.example.prog.entity.UserDtls;
import com.example.prog.repository.InvestmentProfileRepository;
import com.example.prog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InvestmentProfileService {

    @Autowired
    private InvestmentProfileRepository profileRepo;

    @Autowired
    private UserRepository userRepository;

    public InvestmentProfile saveProfile(String email, InvestmentProfile profileRequest) {
        Optional<UserDtls> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        UserDtls user = userOpt.get();
        InvestmentProfile profile = new InvestmentProfile();
        profile.setEmail(email);
        profile.setFullname(user.getFullname());

        profile.setUserInvestmentExperience(profileRequest.getUserInvestmentExperience());
        profile.setPrimaryInvestmentGoal(profileRequest.getPrimaryInvestmentGoal());
        profile.setPreferredAssetType(profileRequest.getPreferredAssetType());
        profile.setInvestmentActivityFrequency(profileRequest.getInvestmentActivityFrequency());
        profile.setMainInvestmentChallenge(profileRequest.getMainInvestmentChallenge());

        profile.setCompleted(true);
        profile.setSkipped(false);

        return profileRepo.save(profile);
    }

    public InvestmentProfile skipProfile(String email) {
        if (profileRepo.existsByEmail(email)) {
            return profileRepo.findByEmail(email).get();
        }

        Optional<UserDtls> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        InvestmentProfile profile = new InvestmentProfile();
        profile.setEmail(email);
        profile.setFullname(userOpt.get().getFullname());
        profile.setCompleted(false);
        profile.setSkipped(true);

        return profileRepo.save(profile);
    }

    public boolean hasCompletedQuiz(String email) {
        return profileRepo.findByEmail(email)
                .map(InvestmentProfile::isCompleted)
                .orElse(false);
    }
}