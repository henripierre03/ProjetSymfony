<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Dette;
use App\Entity\Paiement;
use App\Repository\ClientRepository;
use App\Repository\DetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DetteController extends AbstractController
{
    #[Route('api/dettes', name: 'get_all_dettes', methods: ['GET'])]
    public function getAllDettes(DetteRepository $detteRepository): JsonResponse
    {
        $dettes = $detteRepository->findAll();

        $data = array_map(function (Dette $dette) {
            return [
                'id' => $dette->getId(),
                'montantTotal' => $dette->getMontantTotal(),
                'montantRestant' => $dette->getMontantRestant(),
                'montantVerser' => $dette->getMontantVerser(),
            ];
        }, $dettes);

        return $this->json($data);
    }

    #[Route('api/dette/{id}', name: 'get_dette', methods: ['GET'])]
    public function getDette(DetteRepository $detteRepository, int $id): JsonResponse
    {
        $dette = $detteRepository->find($id);

        if (!$dette) {
            return $this->json(['error' => 'Dette not found'], 404);
        }

        $data = [
            'id' => $dette->getId(),
            'montantTotal' => $dette->getMontantTotal(),
            'montantRestant' => $dette->getMontantRestant(),
            'montantVerser' => $dette->getMontantVerser(),
        ];

        return $this->json($data);
    }

    #[Route('api/dettes', name: 'create_dette', methods: ['POST'])]
public function createDette(
    Request $request,
    ClientRepository $clientRepository,
    Security $security,
    EntityManagerInterface $entityManager
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    $montantTotal = $data['montantTotal'] ?? null;
    $montantRestant = $data['montantRestant'] ?? null;
    $montantVerser = $data['montantVerser'] ?? null;
    $articlesData = $data['articles'] ?? [];
    $paiementsData = $data['paiements'] ?? [];

    if ($montantTotal === null || $montantRestant === null) {
        return $this->json(['error' => 'Invalid data'], 400);
    }

    // Récupérer l'utilisateur connecté
    $user = $security->getUser();

    if (!$user) {
        return $this->json(['error' => 'User not authenticated'], 401);
    }

    // Trouver le client associé à l'utilisateur connecté
    $client = $clientRepository->findOneBy(['user_id' => $user]);

    if (!$client) {
        return $this->json(['error' => 'Client not found for the current user'], 404);
    }

    // Créer une nouvelle dette
    $dette = new Dette();
    $dette->setMontantTotal($montantTotal);
    $dette->setMontantRestant($montantRestant);
    $dette->setMontantVerser($montantVerser);
    $dette->setClientId($client); // Associer le client

    // Ajouter les articles
    foreach ($articlesData as $articleData) {
        $article = new Article();
        $article->setLibelle($articleData['nom'] ?? '');
        $article->setPrix($articleData['prix'] ?? 0);
        $article->setQteStock($articleData['quantite'] ?? 0);
        $entityManager->persist($article);
    }

    // Ajouter les paiements
    foreach ($paiementsData as $paiementData) {
        $paiement = new Paiement();
        $paiement->setMontantPayer($paiementData['montant'] ?? 0);
        $paiement->setDate(new \DateTime($paiementData['date'] ?? 'now'));
        $paiement->setDetteId($dette); // Associer le paiement à la dette
        $entityManager->persist($paiement);
    }

    $entityManager->persist($dette);
    $entityManager->flush();

    return $this->json(['message' => 'Dette created successfully', 'id' => $dette->getId()], 201);
}


    #[Route('api/dette/{id}', name: 'update_dette', methods: ['PUT'])]
    public function updateDette(Request $request, DetteRepository $detteRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $dette = $detteRepository->find($id);

        if (!$dette) {
            return $this->json(['error' => 'Dette not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $montantTotal = $data['montantTotal'] ?? null;
        $montantRestant = $data['montantRestant'] ?? null;
        $montantVerser = $data['montantVerser'] ?? null;

        if ($montantTotal !== null) {
            $dette->setMontantTotal($montantTotal);
        }

        if ($montantRestant !== null) {
            $dette->setMontantRestant($montantRestant);
        }

        if ($montantVerser !== null) {
            $dette->setMontantVerser($montantVerser);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Dette updated successfully']);
    }

    #[Route('api/dette/{id}', name: 'delete_dette', methods: ['DELETE'])]
    public function deleteDette(DetteRepository $detteRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $dette = $detteRepository->find($id);

        if (!$dette) {
            return $this->json(['error' => 'Dette not found'], 404);
        }

        $entityManager->remove($dette);
        $entityManager->flush();

        return $this->json(['message' => 'Dette deleted successfully']);
    }
}