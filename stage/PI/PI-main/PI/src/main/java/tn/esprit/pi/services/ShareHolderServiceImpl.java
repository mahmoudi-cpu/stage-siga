package tn.esprit.pi.services;
import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.IEventRepository;
import tn.esprit.pi.repositories.IShareholderRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ShareHolderServiceImpl implements ShareHolderService {
    IShareholderRepository Ishareholderrepository;
    IEventRepository iEventRepository;

    // EmailSenderService emailSenderService;

    @Override
    public List<ShareHolder> retrieveAllShareHolder() {

        return Ishareholderrepository.findAll();
    }

    @Override
    public ShareHolder AddShareHolder(ShareHolder shareholder/*, User authentication*/) {
      //  Role userRole = getCurrentUserRole(authentication);

      /*  if (!userRole.equals(Role.SHAREHOLDER) && !userRole.equals(Role.ADMIN)) {
            throw new AccessDeniedException("you're not authorized");
        }*/

        return Ishareholderrepository.save(shareholder);
    }

    public ShareHolder addshareholder(ShareHolder sh, Integer idEvent) {

        Event event = iEventRepository.findById(idEvent).orElse(null);
        sh.setEvent(event);
        Ishareholderrepository.save(sh);
        return sh;
    }

    private Role getCurrentUserRole(User user) {
        return user.getRole();
    }

    @Override
    public void removeShareHolder(Integer numShareholder) {

            Ishareholderrepository.deleteById(numShareholder);

    }

    @Override
    public ShareHolder retrieveShareHolder(Integer numShareholder) {
        return Ishareholderrepository.findById(numShareholder).orElse(null);
    }

    @Override
    public ShareHolder updateShareHolder(ShareHolder shareholder/*, User authentication*/) {
   /*     Role userRole = getCurrentUserRole(authentication);

        if (!userRole.equals(Role.SHAREHOLDER)) {
            throw new AccessDeniedException("you're not authorized");
        }*/
        return Ishareholderrepository.save(shareholder);
    }

    @Override
    public ShareHolder assignShareHoldersToEvent(Integer idShareHolder, Integer idEvent) {
        ShareHolder shareholder = Ishareholderrepository.findById(idShareHolder).orElse(null);
        Event event = iEventRepository.findById(idEvent).orElse(null);
        shareholder.setEvent(event);
        return Ishareholderrepository.save(shareholder);
    }

    public void saveShareHolder(ShareHolder shareHolder) {
        Ishareholderrepository.save(shareHolder);
    }


    public List<ShareHolder> findShareholdersWithMoreThanOneEvent() {

        List<ShareHolder> shareholders = Ishareholderrepository.findAll();
        List<ShareHolder> result = new ArrayList<>();

        for (ShareHolder shareholder : shareholders) {
            Event event = shareholder.getEvent();
            if (event != null && event.getShareHolders() != null && event.getShareHolders().size() > 1) {
                result.add(shareholder);
            }
        }

        return result;
    }

    public int getEventYear(ShareHolder shareHolder) {


            Event event = shareHolder.getEvent();
            if (event != null && event.getDateEvent() != null) {
                return event.getDateEvent().getYear();
            } else {
                // Gérer le cas où l'événement ou sa date est null
                // Vous pouvez retourner une valeur par défaut ou lancer une exception, selon vos besoins
                return -1; // Exemple de valeur par défaut, à remplacer par ce qui convient à votre application
            }

    }

    public ShareHolder findMostFrequentPartner() {
        List<ShareHolder> partnerList = Ishareholderrepository.findMostFrequentPartner(TypeShareholder.SUPPLIER);
        if (!partnerList.isEmpty()) {
            return partnerList.get(0);
        } else {
            return null;
        }
    }

    @Override
    public ShareHolder findLessFrequentPartner() {
        List<ShareHolder> partnerList = Ishareholderrepository.findLessFrequentPartner(TypeShareholder.SUPPLIER);
        if (!partnerList.isEmpty()) {
            return partnerList.get(0);
        } else {
            return null; // retourne null si la liste est vide
        }
    }


    @Override
    public List<ShareHolder> findPartnersWithoutEvents() {
        return Ishareholderrepository.findPartnersWithoutEvents();
    }

    @Override
    public Long countPartnersWithEvents() {
        return Ishareholderrepository.countPartnersWithEvents();
    }

    @Override
    public double getPartnersEventPercentages() {
        Long nbPartnersWithEvents = Ishareholderrepository.countPartnersWithEvents();
        Long nbPartnersWithoutEvents = Ishareholderrepository.count() - nbPartnersWithEvents;
        Long totalPartners = Ishareholderrepository.count();
        double pourcentageWithoutEvents = (double) nbPartnersWithoutEvents / totalPartners * 100.0;
        return pourcentageWithoutEvents;
    }

    @Override
    public double getPartnersEventPercentages1() {
        Long nbPartnersWithEvents = Ishareholderrepository.countPartnersWithEvents();
        Long totalPartners = Ishareholderrepository.count();
        double pourcentageWithEvents = (double) nbPartnersWithEvents / totalPartners * 100.0;
        return pourcentageWithEvents;
    }

    @Override
    public ShareHolder findShareHolderByInvestment(double investment) {
        return Ishareholderrepository.findShareHolderByInvestment(investment);
    }

    @Override
    public double calculateInterestRateForShareholderInEvent(int shareholderId, int eventId) {
        // Récupérer l'actionnaire par son ID
        ShareHolder shareholder = Ishareholderrepository.findById(shareholderId).orElse(null);
        if (shareholder == null) {
            throw new RuntimeException("Shareholder not found with ID: " + shareholderId);
        }

        // Récupérer le type de l'actionnaire
        TypeShareholder type = shareholder.getPartner();

        // Calculer le taux d'intérêt en fonction du type de l'actionnaire
        double interestRate;
        switch (type) {
            case SUPPLIER:
                interestRate = 0.05; // 5%
                break;
            case ASSOCIATION:
                interestRate = 0.03; // 3%
                break;
            case BANK:
                interestRate = 0.02; // 2%
                break;
            default:
                interestRate = 0.01; // 1% (default)
                break;
        }

        return interestRate;
    }

    // Méthode pour estimer le rendement financier potentiel de l'investissement dans un événement pour un actionnaire spécifique
    public double estimateFinancialReturnForShareholderInEvent(int shareholderId, int eventId) {
        // Récupérer l'actionnaire par son ID
        ShareHolder shareholder = Ishareholderrepository.findById(shareholderId).orElse(null);
        if (shareholder == null) {
            throw new RuntimeException("Shareholder not found with ID: " + shareholderId);
        }

        // Récupérer l'événement par son ID
        Event event = iEventRepository.findById(eventId).orElse(null);
        if (event == null) {
            throw new RuntimeException("Event not found with ID: " + eventId);
        }

        // Calculer le taux d'intérêt pour l'actionnaire dans cet événement
        double interestRate = calculateInterestRateForShareholderInEvent(shareholderId, eventId);

        // Estimer le rendement financier de l'investissement dans cet événement
        double financialReturn = shareholder.getInvestment() * interestRate;

        return financialReturn;
    }
    @Transactional
    public void investInEvent(int shareholderId, int eventId, double investmentAmount) {
        ShareHolder shareholder = Ishareholderrepository.findById(shareholderId)
                .orElseThrow(() -> new RuntimeException("Shareholder not found with ID: " + shareholderId));

        Event event = iEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        if (event.getEventStatus() == EventStatus.COMPLETED) {
            throw new RuntimeException("Cannot invest in a completed event.");
        }
        event.setInvestNeeded(event.getInvestNeeded() - shareholder.getInvestment());
        Ishareholderrepository.save(shareholder);
        iEventRepository.save(event);
    }
    @Override
    public double calculateInterestRateForShareholder(double investment, TypeShareholder type) {
        double interestRate;

        switch (type) {
            case SUPPLIER:
                if (investment >= 10000) {
                    interestRate = 0.06; // 6%
                } else if (investment >= 5000) {
                    interestRate = 0.055; // 5.5%
                } else {
                    interestRate = 0.05; // 5%
                }
                break;
            case ASSOCIATION:
                interestRate = 0.03; // 3%
                break;
            case BANK:
                interestRate = 0.02; // 2%
                break;
            default:
                interestRate = 0.01; // 1% (default)
                break;
        }

        return interestRate;
    }




}

