<?php

namespace App\Controller;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController extends AbstractController
{
    #[Route('api/articles', name: 'get_all_articles', methods: ['GET'])]
    public function getAllArticles(ArticleRepository $articleRepository): JsonResponse
    {
        $articles = $articleRepository->findAll();

        $data = array_map(function (Article $article) {
            return [
                'id' => $article->getId(),
                'libelle' => $article->getLibelle(),
                'prix' => $article->getPrix(),
                'qteStock' => $article->getQteStock(),
            ];
        }, $articles);

        return $this->json($data);
    }

    #[Route('api/articles/{id}', name: 'get_article', methods: ['GET'])]
    public function getArticle(ArticleRepository $articleRepository, int $id): JsonResponse
    {
        $article = $articleRepository->find($id);

        if (!$article) {
            return $this->json(['error' => 'Article not found'], 404);
        }

        $data = [
            'id' => $article->getId(),
            'libelle' => $article->getLibelle(),
            'prix' => $article->getPrix(),
            'qteStock' => $article->getQteStock(),
        ];

        return $this->json($data);
    }

    #[Route('api/articles', name: 'create_article', methods: ['POST'])]
    public function createArticle(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['libelle'], $data['prix'], $data['qteStock'])) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $article = new Article();
        $article->setLibelle($data['libelle']);
        $article->setPrix($data['prix']);
        $article->setQteStock($data['qteStock']);

        $entityManager->persist($article);
        $entityManager->flush();

        return $this->json(['message' => 'Article created successfully', 'id' => $article->getId()], 201);
    }

    #[Route('api/articles/{id}', name: 'update_article', methods: ['PUT'])]
    public function updateArticle(Request $request, ArticleRepository $articleRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $article = $articleRepository->find($id);

        if (!$article) {
            return $this->json(['error' => 'Article not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['libelle'])) {
            $article->setLibelle($data['libelle']);
        }
        if (isset($data['prix'])) {
            $article->setPrix($data['prix']);
        }
        if (isset($data['qteStock'])) {
            $article->setQteStock($data['qteStock']);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Article updated successfully']);
    }

    #[Route('api/articles/{id}', name: 'delete_article', methods: ['DELETE'])]
    public function deleteArticle(ArticleRepository $articleRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $article = $articleRepository->find($id);

        if (!$article) {
            return $this->json(['error' => 'Article not found'], 404);
        }

        $entityManager->remove($article);
        $entityManager->flush();

        return $this->json(['message' => 'Article deleted successfully']);
    }
}