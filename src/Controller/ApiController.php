<?php
// src/Controller/Api/PhotoController.php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use symfony\bundle\frameworkbundle\controller\controller;
use App\Entity\Photo;
use Symfony\Component\HttpFoundation\Request;

class ApiController extends AbstractController
{

    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/employees", name="api_employees", methods={"GET"})
     */
    public function getEmployees()
    {
        $employees = $this->entityManager->getRepository(Photo::class)->findAll();
        $data = [];
        foreach ($employees as $employee) {
            $data[] = [
                'id' => $employee->getId(),
                'nom' => $employee->getNom(),
                'prenom' => $employee->getPrenom(),
                'poste' => $employee->getPoste(),
                'agence' => $employee->getAgence(),
                'equipe' => $employee->getEquipe(),
                'photo_pro' => $employee->getPhotoPro(),
                'photo_fun' => $employee->getPhotoFun(),
            ];
        }
        return new JsonResponse($data);
    }

    /**
     * @Route("/api/update-employee/{id}", name="api_update_employee", methods={"GET"})
     */
    public function updateEmployee(Request $request, $id)
    {
        dd($id);
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->find($id);

        dd($employee);
        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Récupérer les nouvelles valeurs depuis le formulaire
        $columnName = $request->request->get('column');
        $newValue = $request->request->get('value');

        // Vérifier que la colonne spécifiée existe dans l'entité
        if (property_exists($employee, $columnName)) {
            // Mettre à jour l'entité avec la nouvelle valeur
            $setterMethod = 'set' . ucfirst($columnName);
            $employee->$setterMethod($newValue);

            // Enregistrer les changements dans la base de données
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Employee record updated successfully.']);
        } else {
            return new JsonResponse(['error' => 'Invalid column name.']);
        }
    }
}

