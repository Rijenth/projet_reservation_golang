package models

import "strconv"

type Command struct {
	ID                   uint        `gorm:"primaryKey" jsonapi:"primary,commands"`
	IdentificationNumber string      `gorm:"unique" jsonapi:"attr,identificationNumber"`
	Description          string      `jsonapi:"attr,description"`
	Status               string      `jsonapi:"attr,status"`
	Amount               float64     `jsonapi:"attr,amount"`
	RestaurantID         uint        `gorm:"not null" json:"-"`
	Restaurant           *Restaurant `jsonapi:"relation,restaurant"`
	Menus                []*Menu     `jsonapi:"relation,menus"`
	Model
}

func (command *Command) Fill(data map[string]string) {
	if data["identificationNumber"] != "" && data["identificationNumber"] != command.IdentificationNumber {
		command.IdentificationNumber = data["identificationNumber"]
	}

	if data["description"] != "" && data["description"] != command.Description {
		command.Description = data["description"]
	}

	if data["status"] != "" && data["status"] != command.Status {
		command.Status = data["status"]
	}

	if data["amount"] != "" {
		float, err := strconv.ParseFloat(data["amount"], 64)

		if err == nil && float != command.Amount {
			command.Amount = float
		}
	}
}

func (command *Command) SetRestaurant(restaurant *Restaurant) {
	command.RestaurantID = restaurant.ID
	command.Restaurant = restaurant
}

func (command *Command) SetMenus(menus []*Menu) {
	command.Menus = menus
}
