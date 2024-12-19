<?php

namespace App\Controller;

use App\Entity\Paiement;
use App\Entity\Dette;
use App\Repository\PaiementRepository;
use App\Repository\DetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PaiementController extends AbstractController
{
    #[Route('api/paiements', name: 'get_all_paiements', methods: ['GET'])]
    public function getAllPaiements(PaiementRepository $paiementRepository): JsonResponse
    {
        $paiements = $paiementRepository->findAll();

        $data = array_map(function (Paiement $paiement) {
            return [
                'id' => $paiement->getId(),
                'date' => $paiement->getDate()?->format('Y-m-d'),
                'montantPayer' => $paiement->getMontantPayer(),
                'detteId' => $paiement->getDetteId()?->getId(),
            ];
        }, $paiements);

        return $this->json($data);
    }

    #[Route('api/paiement/{id}', name: 'get_paiement', methods: ['GET'])]
    public function getPaiement(PaiementRepository $paiementRepository, int $id): JsonResponse
    {
        $paiement = $paiementRepository->find($id);

        if (!$paiement) {
            return $this->json(['error' => 'Paiement not found'], 404);
        }

        $data = [
            'id' => $paiement->getId(),
            'date' => $paiement->getDate()?->format('Y-m-d'),
            'montantPayer' => $paiement->getMontantPayer(),
            'detteId' => $paiement->getDetteId()?->getId(),
        ];

        return $this->json($data);
    }

    #[Route('api/paiements', name: 'create_paiement', methods: ['POST'])]
    public function createPaiement(
        Request $request,
        EntityManagerInterface $entityManager,
        DetteRepository $detteRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $date = isset($data['date']) ? new \DateTime($data['date']) : null;
        $montantPayer = $data['montantPayer'] ?? null;
        $detteId = $data['detteId'] ?? null;

        if ($montantPayer === null || $detteId === null) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $dette = $detteRepository->find($detteId);

        if (!$dette) {
            return $this->json(['error' => 'Dette not found'], 404);
        }

        $paiement = new Paiement();
        $paiement->setDate($date);
        $paiement->setMontantPayer($montantPayer);
        $paiement->setDetteId($dette);

        // Mettre à jour le montant restant de la dette
        $dette->setMontantRestant($dette->getMontantRestant() - $montantPayer);

        $entityManager->persist($paiement);
        $entityManager->flush();

        return $this->json(['message' => 'Paiement created successfully', 'id' => $paiement->getId()], 201);
    }

    #[Route('api/paiement/{id}', name: 'update_paiement', methods: ['PUT'])]
    public function updatePaiement(
        Request $request,
        PaiementRepository $paiementRepository,
        EntityManagerInterface $entityManager,
        int $id
    ): JsonResponse {
        $paiement = $paiementRepository->find($id);

        if (!$paiement) {
            return $this->json(['error' => 'Paiement not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $date = isset($data['date']) ? new \DateTime($data['date']) : null;
        $montantPayer = $data['montantPayer'] ?? null;

        if ($date !== null) {
            $paiement->setDate($date);
        }

        if ($montantPayer !== null) {
            $paiement->setMontantPayer($montantPayer);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Paiement updated successfully']);
    }

    #[Route('api/paiement/{id}', name: 'delete_paiement', methods: ['DELETE'])]
    public function deletePaiement(
        PaiementRepository $paiementRepository,
        EntityManagerInterface $entityManager,
        int $id
    ): JsonResponse {
        $paiement = $paiementRepository->find($id);

        if (!$paiement) {
            return $this->json(['error' => 'Paiement not found'], 404);
        }

        $entityManager->remove($paiement);
        $entityManager->flush();

        return $this->json(['message' => 'Paiement deleted successfully']);
    }
}