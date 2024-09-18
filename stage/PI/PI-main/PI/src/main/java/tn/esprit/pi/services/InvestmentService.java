package tn.esprit.pi.services;

import tn.esprit.pi.entities.Investment;
import tn.esprit.pi.entities.User;

import java.util.List;

public interface InvestmentService {

  public List<Investment> retiveAllInvestments();
  public Investment retriveInvestment (Integer idInvestment);
  //Investment  addInvestment(Investment i);
  public Investment AddInvestissement(Investment investment);
  void removeInvestment(Integer idInvestment);
  Investment modifyInvestment(Investment investment);
  void assignInvestmentToProject( Integer idInvestment, Long idProject);
  void dessignerInvestmentToProject(Integer idInvestment);
 //  void invest(Integer id_user, Long projectId, Integer numberOfActions, Integer idInvestment);
  void invest(Long projectId, Integer numberOfActions);
  User findInvestorWithMostInvestment();


}

