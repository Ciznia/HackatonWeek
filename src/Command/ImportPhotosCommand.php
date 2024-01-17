<?php

namespace App\Command;

use App\Entity\Photo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;


#[AsCommand(
    name: 'app:import-photos-command',
    description: 'Add a short description for your command',
)]
class ImportPhotosCommand extends Command
{
    private $entityManager;
    private $parameterBag;

    public function __construct(EntityManagerInterface $entityManager, ParameterBagInterface $parameterBag)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
        $this->parameterBag = $parameterBag;
    }

    protected function configure()
    {
        $this->setName('app:import-data')
            ->setDescription('Import data from JSON file to database')
            ->addArgument('file', InputArgument::REQUIRED, 'JSON file path');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $filePath = $input->getArgument('file');

        if (!file_exists($filePath)) {
            $io->error('File not found.');
            return Command::FAILURE;
        }

        $jsonData = json_decode(file_get_contents($filePath), true);

        foreach ($jsonData as $data) {
            $entity = new Photo(); // Remplacez par le nom de votre entité

            // Remplacez les champs ci-dessous par les champs de votre entité
            $entity->setNom($data['nom']);
            $entity->setPrenom($data['prenom']);
            $entity->setPoste($data['poste']);
            $entity->setEquipe($data['equipe']);
            $entity->setAgence($data['agence']);
            $entity->setPhotoPro($data['photo_pro'] ?? '');
            $entity->setPhotoFun($data['photo_fun'] ?? '');

            $this->entityManager->persist($entity);
        }

        $this->entityManager->flush();

        $io->success('Data imported successfully.');

        return Command::SUCCESS;
    }
}
