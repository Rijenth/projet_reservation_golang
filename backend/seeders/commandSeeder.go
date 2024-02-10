package seeders

import (
	"backend/models"
	"backend/services"
	"fmt"
	"math/rand"
	"strconv"

	"github.com/google/uuid"
)

type CommandSeeder struct {
	MenuSeeder MenuSeeder
}

func (commandSeeder *CommandSeeder) factory(restaurant *models.Restaurant, menus []*models.Menu, user *models.User) *models.Command {
	descriptions := []string{
		"Commande express de deux menus à emporter, comprenant des sandwichs et des boissons",
		"Commande de trois menus déjeuner avec des salades fraîches et des boissons non gazeuses",
		"Commande personnalisée pour une fête d'anniversaire avec cinq menus variés et des gâteaux spéciaux",
		"Commande festive avec un menu complet comprenant des entrées, des plats principaux et des desserts",
	}

	descriptionIndex := rand.Intn(len(descriptions))

	var totalAmount float64 = 0

	for _, menu := range menus {
		totalAmount += menu.Price
	}

	var command = models.Command{}

	command.Fill(map[string]string{
		"description": descriptions[descriptionIndex],
		"status":      "delivered",
		"amount":      strconv.FormatFloat(totalAmount, 'f', -1, 64),
	})

	command.SetRestaurant(restaurant)

	command.SetMenus(menus)

	command.SetUser(user)

	return &command
}

func (commandSeeder *CommandSeeder) Create(restaurant *models.Restaurant, menus []*models.Menu, user *models.User, attributes map[string]string) *models.Command {
	var command = *commandSeeder.factory(restaurant, menus, user)

	if len(attributes) > 0 {
		command.Fill(attributes)
	}

	if command.Status == "ready" || command.Status == "delivered" {
		identificationNumber, _ := uuid.NewRandom()

		toString := identificationNumber.String()

		command.SetIdentificationNumber(&toString)
	}

	services.GetConnection().Create(&command)

	if command.ID == 0 {
		fmt.Println("Factory error: Cannot create command")

		return nil
	}

	return &command
}
