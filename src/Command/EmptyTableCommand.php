<?php

// src/Command/EmptyTableCommand.php
namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'EmptyTableCommand',
    description: 'Add a short description for your command',
)]
class EmptyTableCommand extends Command
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this->setName('app:empty-table')
            ->setDescription('Empty the table associated with VotreEntite'); // Update with a meaningful description
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        // Replace VotreEntite with the name of your entity
        $tableName = $this->entityManager->getClassMetadata('App\Entity\Photo')->getTableName();

        $connection = $this->entityManager->getConnection();
        $platform = $connection->getDatabasePlatform();

        $connection->executeUpdate($platform->getTruncateTableSQL($tableName, true /* cascade */));

        $io->success('Table emptied successfully.');

        return Command::SUCCESS;
    }
}

