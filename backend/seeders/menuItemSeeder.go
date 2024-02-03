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

	var MenuItem = models.MenuItem{}

	MenuItem.Fill(map[string]string{
		"name":  faker.Name(),
		"type":  menuItemType[rand.Intn(len(menuItemType))],
		"price": strconv.FormatFloat(rand.Float64()*100, 'f', 2, 64),
	})

	MenuItem.SetRestaurant(restaurant)

	return &MenuItem
}

func (menuItemSeeder MenuItemSeeder) Create(restaurant *models.Restaurant, attributes map[string]string) *models.MenuItem {
	var menuItem = *menuItemSeeder.factory(restaurant)

	if len(attributes) > 0 {
		menuItem.Fill(attributes)
	}

	services.GetConnection().Create(&menuItem)

	if menuItem.ID == 0 {
		return nil
	}

	return &menuItem
}
