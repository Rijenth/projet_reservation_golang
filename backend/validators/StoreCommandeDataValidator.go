package validators

type StoreCommandeDataValidator struct {
	Data struct {
		Type       string              `validate:"required,eq=commandes"`
		Attributes StoreCommandeAttributes `json:"attributes"`
	} `json:"data"`
}

type StoreCommandeAttributes struct {
	Description	string `validate:"required"`
	Status	string `validate:"required"`
	//Menus	[]uint `validate:"required"`
}