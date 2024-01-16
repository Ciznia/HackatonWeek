<?php
// src/Controller/Api/PhotoController.php

namespace App\Controller;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use symfony\bundle\frameworkbundle\controller\controller;
use App\Entity\Photo;

class ApiController extends AbstractController
{

    private $doctrine;
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @Route("/api/employees", name="api_employees", methods={"GET"})
     */
    public function getEmployees()
    {
        $employees = $this->doctrine->getRepository(Photo::class)->findAll();
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

