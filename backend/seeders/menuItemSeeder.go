package seeders

import (
	"backend/models"
	"backend/services"
	"math/rand"
	"strconv"

	"github.com/bxcodec/faker/v3"
)

type MenuItemSeeder struct {
}

func (menuItemSeeder MenuItemSeeder) factory(restaurant *models.Restaurant) *models.MenuItem {
	menuItemType := []string{"started", "main", "dessert", "drink"}

	var MenuItem = models.MenuItem{
		Name:         faker.Name(),
		Type:         menuItemType[rand.Intn(len(menuItemType))],
		Price:        float64(rand.Intn(10) + 1),
		RestaurantID: restaurant.ID,
	}

	return &MenuItem
}

func (menuItemSeeder MenuItemSeeder) Create(restaurant *models.Restaurant, attributes map[string]string) *models.MenuItem {
	var menuItem = *menuItemSeeder.factory(restaurant)

	if len(attributes) > 0 {
		for key, value := range attributes {
			switch key {
			case "name":
				menuItem.Name = value
			case "type":
				menuItem.Type = value
			case "price":
				float, err := strconv.ParseFloat(value, 64)

				if err != nil {
					return nil
				}

				menuItem.Price = float
			}
		}
	}

	services.GetConnection().Create(&menuItem)

	if menuItem.ID == 0 {
		return nil
	}

	return &menuItem
}
