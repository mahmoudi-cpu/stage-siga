package tn.esprit.pi.services;

import tn.esprit.pi.entities.ShareHolder;
import tn.esprit.pi.entities.TypeShareholder;
import tn.esprit.pi.entities.User;

import java.util.List;

public interface ShareHolderService {
    List<ShareHolder> retrieveAllShareHolder( );
    ShareHolder addshareholder (ShareHolder sh, Integer idEvent);

    ShareHolder AddShareHolder(ShareHolder shareholder/*, User authentication*/);
    void removeShareHolder(Integer numShareholder);
    ShareHolder retrieveShareHolder(Integer numShareholder);
    ShareHolder updateShareHolder(ShareHolder shareholder);
    ShareHolder assignShareHoldersToEvent(Integer idShareHolder, Integer idEvent);
    void saveShareHolder(ShareHolder shareHolder);

    List<ShareHolder> findShareholdersWithMoreThanOneEvent();
    int getEventYear(ShareHolder shareHolder);
   // void assignShareholderToEvent(int idShareholder, int idEvent);

    ShareHolder findMostFrequentPartner();
    double calculateInterestRateForShareholderInEvent(int shareholderId, int eventId);
    double estimateFinancialReturnForShareholderInEvent(int shareholderId, int eventId);
    void investInEvent(int shareholderId, int eventId, double investmentAmount);
    double calculateInterestRateForShareholder(double investment, TypeShareholder type);



    ShareHolder findLessFrequentPartner();

    List<ShareHolder> findPartnersWithoutEvents();

    Long countPartnersWithEvents();

    double getPartnersEventPercentages();

    double getPartnersEventPercentages1();
    ShareHolder findShareHolderByInvestment(double investment);
}
