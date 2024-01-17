<?php

namespace App\Controller;

use App\Entity\Photo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiEmployeeDELETEController extends AbstractController
{

    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    /**
     * @Route("/api/delete-employee/{id}", name="api_delete_employee", methods={"DELETE"})
     */
    public function deleteEmployee($id)
    {
        // Récupérer l'employé à supprimer
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['nom' => $id]);

        if (!$employee) {
            throw $this->createNotFoundException('Employee not found');
        }

        // Supprimer l'entité de la base de données
        $this->entityManager->remove($employee);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Employee record deleted successfully.']);
    }
}



















