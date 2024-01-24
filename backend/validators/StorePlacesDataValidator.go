package validators

type StorePlacesDataValidator struct {
	Data struct {
		Type        string                         `validate:"required,eq=places"`
		Attributes  StorePlacesAttributes          `json:"attributes"`
		Restaurants []StoreRestaurantDataValidator `json:"restaurants,omitempty"`
	} `json:"data"`
}

type StorePlacesAttributes struct {
	Name   string `validate:"required"`
	Adress string `validate:"required"`
}
