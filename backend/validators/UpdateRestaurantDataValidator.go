package validators

type UpdateRestaurantDataValidator struct {
	Data struct {
		Type       string                     `validate:"required,eq=restaurants"`
		Id         string                     `validate:"required,number"`
		Attributes UpdateRestaurantAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateRestaurantAttributes struct {
	Name string `validate:"required"`
}
