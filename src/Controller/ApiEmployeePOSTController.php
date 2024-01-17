<?php

namespace App\Controller;

use App\Entity\Photo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiEmployeePOSTController extends AbstractController
{

    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/add-employee", name="api_add_employee", methods={"POST"})
     */
    public function addEmployee(Request $request)
    {
        // Get data from the request body (assuming JSON format)
        $formData = $request->request->all();
        // Create a new Photo entity
        $employee = new Photo();
        $employee->setNom($formData['nom']);
        $employee->setPrenom($formData['prenom']);
        $employee->setPoste($formData['poste']);
        $employee->setEquipe($formData['equipe']);
        $employee->setAgence($formData['agence']);
        $employee->setPhotoPro($formData['photo_pro']);
        $employee->setPhotoFun($formData['photo_fun']);

        // Persist the new employee entity
        $this->entityManager->persist($employee);

        // Flush changes to the database
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record added successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/update-employee-poste/{id}", name="api_update_employee-poste", methods={"POST"})
     */
    public function updateEmployeePoste(Request $request, $id)
    {
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['nom' => $id]);
        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Récupérer les nouvelles valeurs depuis le formulaire
        $newValue = $request->request->get('poste');
        // Mettre à jour l'entité avec la nouvelle valeur
        $employee->setPoste($newValue);

        // Enregistrer les changements dans la base de données
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record updated successfully.']);
    }

    /**
     * @Route("/api/update-employee-agence/{id}", name="api_update_employee-agence", methods={"POST"})
     */
    public function updateEmployeeAgence(Request $request, $id)
    {
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['nom' => $id]);
        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Récupérer les nouvelles valeurs depuis le formulaire
        $newValue = $request->request->get('agence');

        // Mettre à jour l'entité avec la nouvelle valeur
        $employee->setAgence($newValue);

        // Enregistrer les changements dans la base de données
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record updated successfully.']);
    }

    /**
     * @Route("/api/update-employee-equipe/{id}", name="api_update_employee_equipe", methods={"POST"})
     */
    public function updateEmployeeEquipe(Request $request, $id)
    {
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['nom' => $id]);
        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Récupérer les nouvelles valeurs depuis le formulaire
        $newValue = $request->request->get('equipe');

        // Mettre à jour l'entité avec la nouvelle valeur
        $employee->setEquipe($newValue);

        // Enregistrer les changements dans la base de données
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record updated successfully.']);
    }

    /**
     * @Route("/api/update-employee-name/{id}", name="api_update_employee-name", methods={"POST"})
     */

    public function updateEmployeeName(Request $request, $id)
    {
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['nom' => $id]);
        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Récupérer les nouvelles valeurs depuis le formulaire
        $newValue = $request->request->get('nom');

        // Mettre à jour l'entité avec la nouvelle valeur
        $employee->setNom($newValue);

        // Enregistrer les changements dans la base de données
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record updated successfully.']);
    }

    /**
     * @Route("/api/update-employee-firstname/{id}", name="api_update_employee-firstname", methods={"POST"})
     */

    public function updateEmployeeFirstname(Request $request, $id)
    {
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['nom' => $id]);
        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Récupérer les nouvelles valeurs depuis le formulaire
        $newValue = $request->request->get('prenom');

        // Mettre à jour l'entité avec la nouvelle valeur
        $employee->setPrenom($newValue);

        // Enregistrer les changements dans la base de données
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record updated successfully.']);
    }
}
