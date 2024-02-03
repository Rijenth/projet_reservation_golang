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

	var command = models.Command{}

	command.Fill(map[string]string{
		"identificationNumber": identificationNumber.String(),
		"description":          descriptions[descriptionIndex],
		"status":               status[statusIndex],
		"amount":               strconv.FormatFloat(totalAmount, 'f', -1, 64),
	})

	command.SetRestaurant(restaurant)

	command.SetMenus(menus)

	return &command
}

func (commandSeeder *CommandSeeder) Create(restaurant *models.Restaurant, attributes map[string]string) *models.Command {
	var command = *commandSeeder.factory(restaurant)

	if len(attributes) > 0 {
		command.Fill(attributes)
	}

	services.GetConnection().Create(&command)

	if command.ID == 0 {
		return nil
	}

	return &command
}
