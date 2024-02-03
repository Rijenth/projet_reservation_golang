package models

type Place struct {
	ID          uint          `gorm:"primaryKey" jsonapi:"primary,places"`
	Name        string        `jsonapi:"attr,name"`
	Adress      string        `jsonapi:"attr,adress"`
	UserID      uint          `gorm:"not null" json:"-"`
	User        *User         `jsonapi:"relation,user"`
	Restaurants []*Restaurant `gorm:"foreignKey:PlaceID" jsonapi:"relation,restaurants"`
	Model
}

func (place *Place) Fill(data map[string]string) {
	if data["name"] != "" && data["name"] != place.Name {
		place.Name = data["name"]
	}

	if data["adress"] != "" && data["adress"] != place.Adress {
		place.Adress = data["adress"]
	}
}

func (place *Place) SetUser(user *User) {
	place.UserID = user.ID
	place.User = user
}
