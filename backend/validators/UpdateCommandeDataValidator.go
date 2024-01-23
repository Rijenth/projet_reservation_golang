package validators

type UpdateCommandeDataValidator struct {
	Data struct {
		Type       string                     `validate:"required,eq=commandes"`
		Id         string                     `validate:"required,number"`
		Attributes UpdateCommandeAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateCommandeAttributes struct {
	Description	string `validate:"required"`
	Status	string `validate:"required"`
	//Menus	[]uint `validate:"required"`
}