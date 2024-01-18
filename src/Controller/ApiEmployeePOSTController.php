<?php

namespace App\Controller;

use App\Entity\Photo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpKernel\KernelInterface;



class ApiEmployeePOSTController extends AbstractController
{

    private $entityManager;
    private $filesystem;
    private $kernel;
    public function __construct(EntityManagerInterface $entityManager, Filesystem $filesystem, KernelInterface $kernel)
    {
        $this->entityManager = $entityManager;
        $this->filesystem = $filesystem;
        $this->kernel = $kernel;

    }

    /**
     * @Route("/api/add-employee", name="api_add_employee", methods={"POST"})
     */
    public function addEmployee(Request $request)
    {
        // Get data from the request body (assuming JSON format)
        $formData = $request->request->all();

        if (!isset($formData['nom']) || !isset($formData['prenom']) || !isset($formData['poste']) || !isset($formData['equipe']) || !isset($formData['agence']) || !isset($formData['photo_pro']) || !isset($formData['photo_fun'])) {
            return new JsonResponse(['error' => 'Incomplete data provided.'], Response::HTTP_BAD_REQUEST);
        }
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
        dd("ok");
        // Récupérer l'employé à mettre à jour
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['id' => $id]);
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
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['id' => $id]);
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
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['id' => $id]);
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
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['id' => $id]);
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
        $employee = $this->entityManager->getRepository(Photo::class)->findOneBy(['id' => $id]);
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

    /**
     * @Route("/traiter_image", name="traiter_image", methods={"POST"})
     */
    public function traiterImage(Request $request): Response
    {
        // Obtenez le chemin absolu de l'image depuis le corps de la requête
        $cheminImageEncoded = $request->getContent();
        $cheminImage = urldecode($cheminImageEncoded);
        $cheminImage = str_replace("https://127.0.0.1:8000", "/public", $cheminImage);
        // Divise la chaîne en un tableau en fonction du caractère "/"
        $segments = explode('/', $cheminImage);
        // Supprime le premier élément du tableau
        array_shift($segments);

        // Rejoins les éléments restants pour former le nouveau chemin
        $cheminImage = '/' . implode('/', $segments);
        $cheminImage = $this->kernel->getProjectDir() . $cheminImage;
        try {
            // Vérifiez que le fichier existe avant de le traiter
            if ($this->filesystem->exists($cheminImage)) {
                // Lisez le contenu du fichier
                $imageContent = file_get_contents($cheminImage);

                // Convertissez l'image en un objet bytes
                $response = new Response(base64_encode($imageContent));
                $response->headers->set('Content-Type', 'application/octet-stream');

                return $response;
            } else {
                // Fichier non trouvé
                return new Response('File not found : ' . $cheminImage, Response::HTTP_NOT_FOUND);
            }
        } catch (\Exception $e) {
            // En cas d'erreur, renvoyez une réponse d'erreur
            return new Response($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
