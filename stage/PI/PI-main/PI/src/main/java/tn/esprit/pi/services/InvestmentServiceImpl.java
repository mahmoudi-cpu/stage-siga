package tn.esprit.pi.services;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.IInvestmentRepository;
import tn.esprit.pi.repositories.ITransactionRepository;
import tn.esprit.pi.repositories.ProjectRepository;
import tn.esprit.pi.repositories.UserRepository;


import java.util.*;

@Service
@AllArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {
  IInvestmentRepository investmentRepository;
  ProjectRepository projectRepository;
  UserRepository userRepository;
    ITransactionRepository transactionRepository;
  @Secured({"ADMIN"})
  public List<Investment> retiveAllInvestments() {
    return investmentRepository.findAll();
  }
  @Secured({"ADMIN", "AGENT", "INVESTOR"})
  public Investment retriveInvestment(Integer idInvestment) {
    return investmentRepository.findById(idInvestment).get();
  }

  @Secured({"INVESTOR"})
  public Investment AddInvestissement(Investment investment){


    investment.setDate_inevt(Calendar.getInstance().getTime());
    Calendar calendar = Calendar.getInstance();

    calendar.setTime(Calendar.getInstance().getTime());
    calendar.add(Calendar.MONTH, 12);
    Date investDate= calendar.getTime();
    investment.setDate_inevt(investDate);
    return investmentRepository.save(investment);
  }

 @Secured({"ADMIN"})
  public void removeInvestment(Integer idInvestment) {
    investmentRepository.deleteById(idInvestment);
  }
  @Secured({"ADMIN", "AGENT"})
  public Investment modifyInvestment(Investment investment) {
    return investmentRepository.save(investment);
  }

  public void assignInvestmentToProject( Integer idInvestment, Long idProject) {
    Project project = projectRepository.findById(idProject).get();
    Investment investment = investmentRepository.findById(idInvestment).get();
// on set le fils dans le parent :
    investment.setProject(project);
    projectRepository.save(project);
  }

  public void dessignerInvestmentToProject(Integer idInvestment) {
    Investment investment = investmentRepository.findById(idInvestment).get();

// on set le fils dans le parent :
    investment.setProject(null);
    investmentRepository.save(investment);
  }

  @Secured({"INVESTOR"})
  @Transactional
  public void invest(Long projectId, Integer numberOfActions) {
    // Get the current user's ID from security context
    String currentUserId = getCurrentUserIdFromSecurityContext();

    // Validate input parameters
    if (currentUserId == null || projectId == null || numberOfActions <= 0) {
      throw new IllegalArgumentException("Invalid input parameters");
    }
    // Find the user
    User user = userRepository.findByEmail(currentUserId)
      .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    Project project = projectRepository.findById(projectId)
      .orElseThrow(() -> new IllegalArgumentException("Project not found"));

    // Check if the project is already fully funded
    if (project.getStatus_Invest() == Status_inv.COMPLETED) {
      throw new IllegalStateException("The investment is completed.");
    }
    // Check if the status of the project is still not approved
    if (project.getStatus_project() == statusProject.Still_Not_Approved) {
      throw new IllegalStateException("Project is not approved yet.");
    }

    // Calculate the total investment amount per action
    float investmentPerAction = project.getInvestNeed() / 80f;

    // Calculate the total investment amount for the given number of actions
    float totalInvestmentAmount = numberOfActions * investmentPerAction;

    // Deduct the investment amount from the user's balance
    float userBalance = user.getAmount();
    float totalInvestmentWithInterest = totalInvestmentAmount + (totalInvestmentAmount * 0.10f); // Assuming 10% interest
    if (userBalance < totalInvestmentWithInterest) {
      throw new IllegalStateException("Insufficient balance.");
    }
    user.setAmount(userBalance - totalInvestmentWithInterest);
    userRepository.save(user);

    // Create and save a transaction record for the investment
    Transaction transaction = new Transaction();
    transaction.setType(Type_transaction.INVESTMENT);
    transaction.setUser(user);
    transactionRepository.save(transaction);

    // Update the project's total raising investment field
    float newTotalRaisingInvestment = project.getTotal_raising_investment() + totalInvestmentAmount;
    project.setTotal_raising_investment(newTotalRaisingInvestment);

    // Calculate and update the total interest amount
    float newTotalInterest = project.getTotal_interest() + (totalInvestmentAmount * 0.10f); // Assuming 10% interest
    project.setTotal_interest(newTotalInterest);

    // Check if the project is fully funded and update the status if necessary
    if (newTotalRaisingInvestment >= project.getInvestNeed()) {
      project.setStatus_Invest(Status_inv.COMPLETED);
    }

    // Save the updated project
    projectRepository.save(project);

    // Create and save the investment
    Investment investment = new Investment();
    investment.setNbr_action(numberOfActions);
    investment.setProject(project);
    investmentRepository.save(investment);

    // Add the investment to the user's collection
    user.getInvestment().add(investment);
    userRepository.save(user);
  }

  private String getCurrentUserIdFromSecurityContext() {
    // Get the current authentication object from the security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    // Check if the authentication object is not null and if the principal is an instance of UserDetails
    if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
      // Cast the principal to UserDetails
      UserDetails userDetails = (UserDetails) authentication.getPrincipal();

      // Return the username, which could represent the user's ID
      return userDetails.getUsername();
    } else {
      // If the authentication object is null or the principal is not an instance of UserDetails,
      return null;
    }
  }
  @Secured({"ADMIN", "AGENT"})
  public User findInvestorWithMostInvestment() {
    List<Transaction> transactions = transactionRepository.findByType(Type_transaction.INVESTMENT);
    Map<User, Float> investmentSumByUser = new HashMap<>();

    // Calculate total investment amount for each investor
    for (Transaction transaction : transactions) {
      User investor = transaction.getUser();
      Float investmentAmount = transaction.getValue(); // Use Float instead of float
      if (investmentAmount != null) {
        // Check if the investment amount is not null before adding to the sum
        investmentSumByUser.put(investor, investmentSumByUser.getOrDefault(investor, 0f) + investmentAmount);
      }
    }

    // Find user with maximum investment
    User investorWithMostInvestment = null;
    float maxInvestmentAmount = Float.MIN_VALUE;
    for (Map.Entry<User, Float> entry : investmentSumByUser.entrySet()) {
      float investmentAmount = entry.getValue();
      if (investmentAmount > maxInvestmentAmount) {
        maxInvestmentAmount = investmentAmount;
        investorWithMostInvestment = entry.getKey();
      }
    }

    return investorWithMostInvestment;
  }




}
