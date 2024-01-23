package validators

type StoreRestaurantDataValidator struct {
	Data struct {
		Type       string              `validate:"required,eq=restaurants"`
		Attributes StoreRestaurantAttributes `json:"attributes"`
	} `json:"data"`
}

type StoreRestaurantAttributes struct {
	Name	string `validate:"required"`
}
