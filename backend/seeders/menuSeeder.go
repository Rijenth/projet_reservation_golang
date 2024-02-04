package seeders

import (
	"backend/models"
	"backend/services"
	"fmt"
	"math/rand"
	"strconv"

	"github.com/bxcodec/faker/v3"
)

type MenuSeeder struct {
}

func (menuSeeder MenuSeeder) factory(restaurant *models.Restaurant) *models.Menu {
	price := rand.Intn(33) + 8

	var menu = models.Menu{}

	menu.Fill(map[string]string{
		"name":  faker.Name(),
		"price": strconv.Itoa(price),
	})

	if restaurant != nil {
		menu.SetRestaurant(restaurant)
	} else {
		fmt.Println("Factory error: Cannot create a menu without a restaurant")
	}

	return &menu
}

func (menuSeeder MenuSeeder) Create(restaurant *models.Restaurant, menuItems []*models.MenuItem, attributes map[string]string) *models.Menu {
	var menu = *menuSeeder.factory(restaurant)

	if len(attributes) > 0 {
		menu.Fill(attributes)
	}

	menu.SetMenuItems(menuItems)

	services.GetConnection().Create(&menu)

	if menu.ID == 0 {
		fmt.Println("Factory error: Cannot create menu")

		return nil
	}

	return &menu
}
