<?php

namespace App\Controller;

use Amp\Serialization\Serializer;
use App\Entity\DemandeDette;
use App\Repository\DemandeDetteRepository;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class DemandeDetteController extends AbstractController
{
    private $demandeDetteRepository;
    private $clientRepository;
    private $entityManager;

    public function __construct(DemandeDetteRepository $demandeDetteRepository, ClientRepository $clientRepository, EntityManagerInterface $entityManager)
    {
        $this->demandeDetteRepository = $demandeDetteRepository;
        $this->clientRepository = $clientRepository;
        $this->entityManager = $entityManager;
    }

    // Liste des demandes de dette
    #[Route('/api/demandes-dette', name: 'get_demandes_dette', methods: ['GET'])]
    public function getDemandesDette(): Response
    {
        $demandes = $this->demandeDetteRepository->findAll();

        // Convertir manuellement les objets en tableau associatif
        $demandesArray = array_map(function ($demande) {
            return [
                'id' => $demande->getId(),
                'montantTotal' => $demande->getMontantTotal(),
                'etat' => $demande->getEtat(),
                'date' => $demande->getDate()->format('Y-m-d'), // Formater la date
            ];
        }, $demandes);

        // Encoder en JSON
        $jsonContent = json_encode($demandesArray);

        // Retourner la réponse JSON
        return new Response($jsonContent, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }


    // Créer une nouvelle demande de dette
    #[Route('/api/demandes-dette', name: 'create_demandes_dette', methods: ['POST'])]
    public function createDemandeDette(
        Request $request,
        ClientRepository $clientRepository,
        Security $security,
        EntityManagerInterface $entityManager
    ): Response {
        $data = json_decode($request->getContent(), true);

        $user = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        // Trouver le client associé à l'utilisateur connecté
        $client = $clientRepository->findOneBy(['user_id' => $user]);

        if (!$client) {
            return $this->json(['error' => 'Client not found for the current user'], 404);
        }

        $demandeDette = new DemandeDette();
        $demandeDette->setDate(new \DateTime($data['date']));
        $demandeDette->setEtat($data['etat']);
        $demandeDette->setMontantTotal($data['montantTotal']);
        $demandeDette->setClientId($client);

        $this->entityManager->persist($demandeDette);
        $this->entityManager->flush();

        return new Response('Demande de dette créée avec succès', Response::HTTP_CREATED);
    }

    // Modifier une demande de dette
    #[Route('/api/demandes-dette/{id}', name: 'edit_demandes_dette', methods: ['PATCH'])]
    public function editDemandeDette(int $id, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $demandeDette = $this->demandeDetteRepository->find($id);
        if (!$demandeDette) {
            return new Response('Demande de dette non trouvée', Response::HTTP_NOT_FOUND);
        }

        $demandeDette->setDate(new \DateTime($data['date']));
        $demandeDette->setEtat($data['etat']);
        $demandeDette->setMontantTotal($data['montantTotal']);

        $this->entityManager->flush();

        return new Response('Demande de dette modifiée avec succès', Response::HTTP_OK);
    }

    // Supprimer une demande de dette
    #[Route('/api/demandes-dette/{id}', name: 'delete_demandes_dette', methods: ['DELETE'])]
    public function deleteDemandeDette(int $id): Response
    {
        $demandeDette = $this->demandeDetteRepository->find($id);
        if (!$demandeDette) {
            return new Response('Demande de dette non trouvée', Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($demandeDette);
        $this->entityManager->flush();

        return new Response('Demande de dette supprimée avec succès', Response::HTTP_OK);
    }
}