<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    private ?string $surname = null;

    #[ORM\Column(length: 25)]
    private ?string $telephone = null;

    #[ORM\Column(length: 25, nullable: true)]
    private ?string $address = null;

    /**
     * @var Collection<int, Dette>
     */
    #[ORM\OneToMany(targetEntity: Dette::class, mappedBy: 'client_id')]
    private Collection $dettes;

    #[ORM\ManyToOne(inversedBy: 'clients')]
    private ?User $user_id = null;

    /**
     * @var Collection<int, DemandeDette>
     */
    #[ORM\OneToMany(targetEntity: DemandeDette::class, mappedBy: 'client_id')]
    private Collection $demandeDettes;

    public function __construct()
    {
        $this->dettes = new ArrayCollection();
        $this->demandeDettes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): static
    {
        $this->surname = $surname;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }


    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection<int, Dette>
     */
    public function getDettes(): Collection
    {
        return $this->dettes;
    }

    public function addDette(Dette $dette): static
    {
        if (!$this->dettes->contains($dette)) {
            $this->dettes->add($dette);
            $dette->setClientId($this);
        }

        return $this;
    }

    public function removeDette(Dette $dette): static
    {
        if ($this->dettes->removeElement($dette)) {
            // set the owning side to null (unless already changed)
            if ($dette->getClientId() === $this) {
                $dette->setClientId(null);
            }
        }

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    /**
     * @return Collection<int, DemandeDette>
     */
    public function getDemandeDettes(): Collection
    {
        return $this->demandeDettes;
    }

    public function addDemandeDette(DemandeDette $demandeDette): static
    {
        if (!$this->demandeDettes->contains($demandeDette)) {
            $this->demandeDettes->add($demandeDette);
            $demandeDette->setClientId($this);
        }

        return $this;
    }

    public function removeDemandeDette(DemandeDette $demandeDette): static
    {
        if ($this->demandeDettes->removeElement($demandeDette)) {
            // set the owning side to null (unless already changed)
            if ($demandeDette->getClientId() === $this) {
                $demandeDette->setClientId(null);
            }
        }

        return $this;
    }
}