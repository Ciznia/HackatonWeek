<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SchemaModificationRequestRepository::class)
 */

class SchemaModificationRequest
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
    */
    private $id;

    /**
     * @ORM\Column(type="text")
    */
    private $columnName;

}