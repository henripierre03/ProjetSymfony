<?php

namespace App\Controller;

use App\Repository\ClientRepository;
use App\Entity\Client;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ClientController extends AbstractController
{
    private ClientRepository $clientRepository;

    public function __construct(ClientRepository $clientRepository)
    {
        $this->clientRepository = $clientRepository;
    }

    #[Route('api/clients', name: 'api_clients_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $clients = $this->clientRepository->findAll();
        $result = array_map(function (Client $client) {
            return [
                'id' => $client->getId(),
                'surname' => $client->getSurname(),
                'telephone' => $client->getTelephone(),
                'address' => $client->getAddress(),
            ];
        }, $clients);

        return $this->json($result);
    }

    #[Route('api/clients/search', name: 'api_clients_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $phone = $request->query->get('phone');
        if (!$phone) {
            return $this->json(['error' => 'Phone number is required'], 400);
        }

        $client = $this->clientRepository->findClientByPhone($phone);
        if (!$client) {
            return $this->json(['error' => 'Client not found'], 404);
        }

        return $this->json([
            'id' => $client->getId(),
            'surname' => $client->getSurname(),
            'telephone' => $client->getTelephone(),
            'address' => $client->getAddress(),
        ]);
    }

    #[Route('api/clients', name: 'api_clients_create', methods: ['POST'])]
    public function create(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['surname']) || empty($data['telephone']) || empty($data['address'])) {
            return $this->json(['error' => 'Les champs surname, telephone et address sont requis'], 400);
        }

        $client = new Client();
        $client->setSurname($data['surname']);
        $client->setTelephone($data['telephone']);
        $client->setAddress($data['address']);

        // Associer un utilisateur si l'ID est fourni
        if (!empty($data['userId'])) {
            $user = $userRepository->find($data['userId']);
            if (!$user) {
                return $this->json(['error' => 'Utilisateur non trouvé'], 404);
            }
            $client->setUserId($user);
        }

        try {
            $this->clientRepository->save($client);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur lors de la création du client : ' . $e->getMessage()], 500);
        }

        return $this->json(['message' => 'Client créé avec succès'], 201);
    }
    


    #[Route('api/clients/edit/{id}', name: 'api_clients_edit', methods: ['PATCH'])]
    public function edit(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $client = $this->clientRepository->find($id);
        if (!$client) {
            return $this->json(['error' => 'Client not found'], 404);
        }

        if (isset($data['surname'])) {
            $client->setSurname($data['surname']);
        }
        if (isset($data['telephone'])) {
            $client->setTelephone($data['telephone']);
        }
        if (isset($data['address'])) {
            $client->setAddress($data['address']);
        }

        try {
            $this->clientRepository->save($client);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur lors de la mise à jour du client : ' . $e->getMessage()], 500);
        }

        return $this->json(['message' => 'Client updated successfully']);
    }
}