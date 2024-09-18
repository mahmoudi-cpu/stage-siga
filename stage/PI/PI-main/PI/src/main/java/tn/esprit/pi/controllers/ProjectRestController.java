package tn.esprit.pi.controllers;



import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.ProjectRepository;
import tn.esprit.pi.services.IProjectService;
import tn.esprit.pi.services.SMSService;
import tn.esprit.pi.services.UserServiceImp;

import java.util.List;
import java.util.Map;


@RestController
@AllArgsConstructor
@RequestMapping("/project")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectRestController {
  @PersistenceContext
  private EntityManager entityManager;
  IProjectService projectService;
  ProjectRepository projectRepository;
   UserServiceImp userService;
  SMSService smsService;


  // http://localhost:8089/pi/project/retrieve-all-projects
  @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER', 'AGENT')")
  @GetMapping("/retrieve-all-projects")
  public List<Project> getProjects() {
    List<Project> listProjects = projectService.retiveAllProjects();
    return listProjects;
  }
  // http://localhost:8089/pi/project/retrieve-project/8
  @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER', 'AGENT')")
  @GetMapping("/retrieve-project/{project-id}")
  public Project retrieveProject(@PathVariable("project-id") Long projectId) {
    Project project = projectService.retriveProjectById(projectId);
    return project;}
  // http://localhost:8089/pi/project/add-project

  @PreAuthorize("hasAnyAuthority('CUSTOMER')")
  @PostMapping("/projects")
  public void addProject(@RequestBody Project project) {
    projectService.addProject(project);
  }
  // http://localhost:8089/pi/project/remove-project/{project-id}
 /* @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER', 'ADMIN')")
  @DeleteMapping("/remove-project/{project-id}")
  public void removeProject(@PathVariable("project-id") Long chId) {
    projectService.removeProject(chId);
  }

  */
  /*@PutMapping("/desaffecter-user-a-dProject/{project-id}")
  public void desaffecterProjectToUser@PathVariable("projectt-id") Long idProject){
    projectService.dessignerProjectToUser(idProject);
  }*/
/*  @PutMapping("/{id}/validate")
  public ResponseEntity<Project> validateProject(@PathVariable("id") Long projectId, @RequestBody User user) {
    Project validatedProject = projectService.validerProjet(projectId, user);
    return ResponseEntity.status(HttpStatus.OK).body(validatedProject);
  }*/
  @GetMapping("/most-invested")
  public ResponseEntity<Map<CategoryProject, Integer>> getMostInvestedCategories() {
    Map<CategoryProject, Integer> mostInvestedCategories = projectService.getMostInvestedCategories(); // Invoke the service method
    return ResponseEntity.ok(mostInvestedCategories); // Return the result as a response
  }
//@Scheduled(fixedDelay = 15000)

  @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER', 'AGENT')")
  @PutMapping("/update")
  public Project updateProject(@RequestBody Project project) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();
    return projectService.updateProject(project);
  }

  private Role getCurrentUserRole(User currentUser) {
    return currentUser.getRole();
  }
  @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER', 'AGENT')")
  @DeleteMapping("/project/delete/{projectId}")
  public void deleteProject(@PathVariable Long projectId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();
    // Delete the project
    projectService.deleteProject(projectId);
  }

  // Update the method signature to accept user ID instead of User object
  @PreAuthorize("hasAnyAuthority('ADMIN', 'AGENT')")
  @PutMapping("/validateProject")
  public ResponseEntity<String> validateProject(@RequestParam Long projectId) {

    projectService.validerProjet(projectId, smsService);
    Integer id_user = Math.toIntExact(getUserIdByProjectId(projectId)); // Implement this method to retrieve the user ID based on the project ID

    // Retrieve the user using the user ID
    User customer = userService.getUserByid(id_user);

    if (customer == null || customer.getUser_phone() == null || customer.getUser_phone().isEmpty()) {
      throw new IllegalArgumentException("Customer's phone number is missing or invalid");
    }
    String customerPhoneNumber = customer.getUser_phone();
    String message = "Your project has been approved!";

    // Debugging: Print customer's phone number and message
    System.out.println("Customer Phone Number: " + customerPhoneNumber);
    System.out.println("Message: " + message);

    // Send SMS
    smsService.sendSms(customerPhoneNumber, message);
    return ResponseEntity.ok("project validated");
  }
  public Long getUserIdByProjectId(Long idProject) {
    Query query = entityManager.createNativeQuery("SELECT user_id_user FROM user_project WHERE project_id_project = :projectId");
    query.setParameter("projectId", idProject);
    Object result = query.getSingleResult();
    if (result != null) {
      return ((Integer) result).longValue();
    }
    return null;
  }
  @PostMapping("/processSms")
  public String processSms(@RequestBody SMSSendRequest sendRequest){
    log.info("processsmsstarterd"+ sendRequest.toString());
    return smsService.sendSms(sendRequest.getDestnationSMSNumber(), sendRequest.getSmsMessage());
  }
  @GetMapping("/sorted-by-invest-need")
  public ResponseEntity<List<Project>> getProjectsSortedByInvestNeed() {
    List<Project> projects = projectService.getProjectsSortedByInvestNeed();
    return new ResponseEntity<>(projects, HttpStatus.OK);
  }
  @PreAuthorize("hasAnyAuthority('AGENT')")
  @PostMapping("/{projectId}/rate")
  public ResponseEntity<Void> rateProject(@PathVariable Long projectId,
                                          @RequestParam Integer rating,
                                          @RequestParam String feedback,
                                          Authentication authentication) {
    // Retrieve the project from the repository based on the projectId
    Project project = projectRepository.findById(projectId)
      .orElseThrow(() -> new EntityNotFoundException("Project not found"));

    // Get the currently authenticated user
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();

    // Delegate the rating logic to the service
    projectService.rateProject(project, rating, feedback, userDetails);

    return ResponseEntity.ok().build();
  }
  @PreAuthorize("hasAnyAuthority('ADMIN','AGENT')")
  @GetMapping("/total-count")
  public long getTotalProjectCount() {
    return projectService.countProjects();
  }
  @GetMapping("/search")
  public List<Project> searchProjectsByNom(@RequestParam String nom) {
    return projectService.searchProjectsByNom(nom);
  }
  @PreAuthorize("hasAnyAuthority('ADMIN','AGENT')")
  @GetMapping("/average-rating")
  public ResponseEntity<Float> getAverageRating() {
    Float averageRating = projectService.getAverageRating();
    return ResponseEntity.ok(averageRating);
  }


}
