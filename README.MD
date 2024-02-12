# Projet FoodCourt

Créer une application de gestion des commandes dans le cadre d'un FoodCourt. (Aire de restauration)

Délai: 3 semaines

Objectifs : 
1. Initiation au langage de programmation Golang.
2. Mise en application dans le cadre d'un projet.

## Participants

| Nom      | Prénom   | Rôle         |
|----------|----------|--------------|
| ARUMAINATHAN   | Rijenth     | Développeur fullstack  |
| DJAOUT   | Lyes    | Développeur fullstack     |
| PIVERT   | Fabrice   | Développeur backend      |
| LEVEINEUR    | Louis   | Développeur backend |

## Setup

1. Dans le repertoire backend : Renommer le fichier `.env.example` en `.env`

2. Dans le repertoire frontend : Renommer le fichier `.env.example` en `.env`

3. Lancer la commande : `docker-compose up -d --build`

4. Accéder à <a href="http://localhost:3000">l'application</a>

5. Utiliser le bouton de seeding de l'application présent sur la page de connexion

6. Vous obtiendrez des identifiants qui vous permettront de tester les espaces `administrateur`, `restaurateur` et `client`

## Notes à JF

#### Problèmes rencontrés pendant la phase de développement de l'API golang :

1. Des difficultés à implémenter une solution de formatage des réponses API (spécifique à JSON:API), mais nous avons finalement réussi.

2. Des incohérences lors de certaines opérations dues à notre manque de maîtrise du langage. Par exemple, sur une route PATCH, lors de la mise à jour d'un attribut d'un modèle lorsque celui-ci est nullable. (Erreur de pointeur vers une adresse mémoire invalide)

3. Lorsque nous avons mis en place des "seeders", dans le but de fournir des données de test au client. Nous avons utilisé les goroutines pour paralléliser la génération de données. Nous voulions créer plusieurs micro-routines pour accélérer au maximum l'exécution du seeder, mais nous avons opté pour une solution moins optimale mais beaucoup plus fonctionnelle et fiable. (Utiliser une seule goroutine qui contient un scénario complet de seeding)

4. La gestion des erreurs API. Plus précisément, les erreurs de validation lors des requêtes POST et PATCH. Étant donné que notre API s'approche le plus possible de la spécification JSON:API, il y a des contraintes que nous avons dû appliquer (avec plus ou moins de réussite) pour valider les relations d'un modèle lors de sa création/mise à jour.

5. Optimiser l'architecture globale du projet a été une tâche plus complexe que prévu, en raison de l'absence d'objet et de l'effet de "plongée" vers l'inconnu. Mais ce nouveau paradigme a été très intéressant à décortiquer.