<?php
// src/Controller/Api/PhotoController.php

namespace App\Controller;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    /**
     * @Route("/api/submitSchemaModificationRequest", name="api_submit_schema_modification_request", methods={"POST"})
     */

    /*
     * This method is used to submit a schema modification request.
     */
    public function submitSchemaModificationRequest(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true); // decode the JSON into an associative array

        $columnName = $data['columnName']; // get the column name from the request

        $entityManager = $this->getDoctrine()->getManager(); // get the entity manager
        $existingColumn = $entityManager->getConnection()->getSchemaManager()->listTableColumns('nom_de_votre_table'); // get the existing columns of your table
        if (isset($existingColumn[$columnName])) { // check if the column already exists
            return new JsonResponse(['status' => 'Column already exists'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $schemaModificationRequest = new SchemaModificationRequest(); // create a new schema modification request
        $schemaModificationRequest->setColumnName($columnName); // set the column name
        $entityManager->persist($schemaModificationRequest); // persist the schema modification request
        $entityManager->flush();

        return new JsonResponse(['status' => 'Schema modification request submitted'], JsonResponse::HTTP_CREATED);
    }
}
