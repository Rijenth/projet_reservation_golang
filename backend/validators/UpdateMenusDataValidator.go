package validators

type UpdateMenusDataValidator struct {
	Data struct {
		Type       string                     `validate:"required,eq=restaurants"`
		Id         string                     `validate:"required,number"`
		Attributes UpdateRestaurantAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateMenusAttributes struct {
	Name string `validate:"required"`
}
