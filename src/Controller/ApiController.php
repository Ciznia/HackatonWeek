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
}

