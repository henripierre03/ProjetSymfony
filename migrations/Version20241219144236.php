<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241219144236 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE demande_dette (id SERIAL NOT NULL, client_id_id INT NOT NULL, date DATE DEFAULT NULL, etat BOOLEAN NOT NULL, montant_total DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_75C54B21DC2902E0 ON demande_dette (client_id_id)');
        $this->addSql('ALTER TABLE demande_dette ADD CONSTRAINT FK_75C54B21DC2902E0 FOREIGN KEY (client_id_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE demande_dette DROP CONSTRAINT FK_75C54B21DC2902E0');
        $this->addSql('DROP TABLE demande_dette');
    }
}
