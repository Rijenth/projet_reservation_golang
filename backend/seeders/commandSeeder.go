package seeders

import (
	"backend/models"
	"backend/services"
	"math/rand"
	"strconv"

	"github.com/google/uuid"
)

type CommandSeeder struct {
	MenuSeeder MenuSeeder
}

func (commandSeeder *CommandSeeder) factory(restaurant *models.Restaurant) *models.Command {
	identificationNumber, _ := uuid.NewRandom()

	numMenus := rand.Intn(4) + 1

	descriptions := []string{
		"Commande express de deux menus à emporter, comprenant des sandwichs et des boissons",
		"Commande de trois menus déjeuner avec des salades fraîches et des boissons non gazeuses",
		"Commande personnalisée pour une fête d'anniversaire avec cinq menus variés et des gâteaux spéciaux",
		"Commande festive avec un menu complet comprenant des entrées, des plats principaux et des desserts",
	}

	status := []string{"not_started", "started", "ready"}

	descriptionIndex := rand.Intn(len(descriptions))
	statusIndex := rand.Intn(len(status))

	menus := make([]*models.Menu, numMenus)

	for i := range menus {
		menus[i] = commandSeeder.MenuSeeder.factory(restaurant)
	}

	var totalAmount float64
	for _, menu := range menus {
		totalAmount += menu.Price
	}

	var Command = models.Command{
		IdentificationNumber: identificationNumber.String(),
		Description:          descriptions[descriptionIndex],
		Status:               status[statusIndex],
		Amount:               totalAmount,
		RestaurantID:         restaurant.ID,
		Menus:                menus,
	}

	return &Command
}

func (commandSeeder *CommandSeeder) Create(restaurant *models.Restaurant, attributes map[string]string) *models.Command {
	var command = *commandSeeder.factory(restaurant)

	if len(attributes) > 0 {
		for key, value := range attributes {
			switch key {
			case "identificationNumber":
				command.IdentificationNumber = value
			case "description":
				command.Description = value
			case "status":
				command.Status = value
			case "amount":
				float, err := strconv.ParseFloat(value, 64)

				if err != nil {
					return nil
				}

				command.Amount = float
			}
		}
	}

	services.GetConnection().Create(&command)

	if command.ID == 0 {
		return nil
	}

	return &command
}
