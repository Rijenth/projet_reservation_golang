package validators

type UpdateMenuItemDataValidator struct {
	Data struct {
		Type       string `validate:"required,eq=menu_items"`
		Id 	   string `validate:"required,number"`
		Attributes UpdateMenuItemAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateMenuItemAttributes struct {
	Name  string  `validate:"required,min=3,max=255"`
	Type string `validate:"required,min=3,max=255"`
	Price float64 `validate:"required"`
}


			