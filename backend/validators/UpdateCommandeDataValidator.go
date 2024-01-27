package validators

type UpdateCommandDataValidator struct {
	Data struct {
		Type       string                     `validate:"required,eq=commands"`
		Id         string                     `validate:"required,number"`
		Attributes UpdateCommandAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateCommandAttributes struct {
	Description	string `validate:"required"`
	Status	string `validate:"required"`
	//Menus	[]uint `validate:"required"`
}