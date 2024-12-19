<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('api/users', name: 'get_all_users', methods: ['GET'])]
    public function getAllUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        $data = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'role' => $user->getRoles(),
                // 'isActive' => $user->isActive(),
                // 'clients' => array_map(function ($client) {
                //     return $client->getId();
                // }, $user->getClients()->toArray()),
            ];
        }, $users);

        return $this->json($data);
    }

    // #[Route('/user/{id}', name: 'get_user', methods: ['GET'])]
    // public function getUser(UserRepository $userRepository, int $id): JsonResponse
    // {
    //     $user = $userRepository->find($id);

    //     if (!$user) {
    //         return $this->json(['error' => 'User not found'], 404);
    //     }

    //     $data = [
    //         'id' => $user->getId(),
    //         'email' => $user->getEmail(),
    //         'role' => $user->getRole(),
    //         'isActive' => $user->isActive(),
    //         'clients' => array_map(function ($client) {
    //             return $client->getId();
    //         }, $user->getClients()->toArray()),
    //     ];

    //     return $this->json($data);
    // }

    #[Route('api/users', name: 'create_user', methods: ['POST'])]
    public function createUser(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $roles = $data['roles'] ?? null;
        $isActive = $data['isActive'] ?? null;

        if (!$email || !$password) {
            return $this->json(['error' => 'Email and password are required'], 400);
        }

        $user = new User();
        $user->setEmail($email)
            ->setRoles($roles);

        // Hachage du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User created successfully', 'id' => $user->getId()], 201);
    }

    #[Route('api/user/{id}', name: 'update_user', methods: ['PUT'])]
    public function updateUser(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        int $id
    ): JsonResponse {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $role = $data['role'] ?? null;
        $isActive = $data['isActive'] ?? null;

        if ($email !== null) {
            $user->setEmail($email);
        }
        if ($password !== null) {
            // Hachage du nouveau mot de passe
            $hashedPassword = $passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashedPassword);
        }
        if ($role !== null) {
            $user->setRole($role);
        }
        if ($isActive !== null) {
            $user->setActive($isActive);
        }

        $entityManager->flush();

        return $this->json(['message' => 'User updated successfully']);
    }


    #[Route('api/user/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(UserRepository $userRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'User deleted successfully']);
    }
}