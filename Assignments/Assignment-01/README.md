# Assignment  01

## Brief

Starting from the concept of a pinboard, implement a web page that:

- is responsive (properly layout for smartphone, tablet, and desktop)
- allows the user to add and remove elements
- allows the user to coustomize elements (i.e. colors, size)
- allows the switch between two views (at least)

## Screenshots
![listViewMobileEmpty](DOCS/listViewMobileEmpty.png) 
![ListViewMobileColorChange](DOCS/ListViewMobileColorChange.png) 
![ListViewMobileFilled](DOCS/ListViewMobileFilled.png)
![CardViewMobileFilled](DOCS/CardViewMobileFilled.png) 
## Project description

General concept is the pinboard where the user can pin some notes. 
Functionality: user can add and delete notes, change the color of the note. User can switch between 2 views, that have support for Mobile, Tablet and Laptop.  

## Lista funzioni 

1) updateEmptyState(): Description shows placeholder if list with notes is empty. Hides otherwise. returns nothing.
2) Adding new note by pressing "Enter" key. anonymous function. Description: lets add new note if Enter key is pressed while focus is on input field.
3) Adding note by pressing "+" button:   anonymous function. Description: adds a new note to the list when the add button is clicked. returns nothing. 
4) switchToListView(): Description: switches the task list to list view mode. returns nothing.
5) switchToCardView(): Description: switches the task list to card view mode. returns nothing.
6) makeListElementComponent(text): param - text that needed to be inserted in the note. Description: returns the HTML content for a list element with the given text.
7) shakeTaskInput(): Description: visually indicates an error by shaking the input field when user tries to add an empty note. returns nothing.



