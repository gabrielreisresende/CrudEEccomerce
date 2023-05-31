    'use strict'

    const openModal = () => document.getElementById('modal')
        .classList.add('active')

    const closeModal = () => {
        clearFields()
        document.getElementById('modal').classList.remove('active')
    }


    const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
    const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))

    // CRUD - create read update delete
    const deleteProduto = (index) => {
        const dbProduto = readProduto()
        dbProduto.splice(index, 1)
        setLocalStorage(dbProduto)
    }

    const updateProduto = (index, produto) => {
        const dbProduto = readProduto()
        dbProduto[index] = produto
        setLocalStorage(dbProduto)
    }

    const readProduto = () => getLocalStorage()

    const createProduto = (produto) => {
        const dbProduto = getLocalStorage()
        dbProduto.push (produto)
        setLocalStorage(dbProduto)
    }

    const isValidFields = () => {
        return document.getElementById('form').reportValidity()
    }

    //Interação com o layout

    const clearFields = () => {
        const fields = document.querySelectorAll('.modal-field')
        fields.forEach(field => field.value = "")
        document.getElementById('id').dataset.index = 'new'
        document.querySelector(".modal-header>h2").textContent  = 'Novo Produto'
    }

    const saveProduto = () => {
        if (isValidFields()) {
            const produto = {
                id: document.getElementById('id').value,
                produto: document.getElementById('produto').value,
                preco: document.getElementById('preco').value,
                descricao: document.getElementById('descricao').value,
                imagem: document.getElementById('imagem').value
            }
            const index = document.getElementById('id').dataset.index
            if (index == 'new') {
                createProduto(produto)
                updateTable()
                closeModal()
            } else {
                updateProduto(index, produto)
                updateTable()
                closeModal()
            }
        }
    }

    const createRow = (produto, index) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.produto}</td>
            <td>${produto.preco}</td>
            <td>${produto.descricao}</td>
            <td>${produto.imagem}</td>
            <td>
                <button type="button" class="button green" id="edit-${index}">Editar</button>
                <button type="button" class="button red" id="delete-${index}" >Excluir</button>
            </td>
        `
        document.querySelector('#tableProduto>tbody').appendChild(newRow)
    }

    const clearTable = () => {
        const rows = document.querySelectorAll('#tableProduto>tbody tr')
        rows.forEach(row => row.parentNode.removeChild(row))
    }

    const updateTable = () => {
        const dbProduto = readProduto()
        clearTable()
        dbProduto.forEach(createRow)
    }

    const fillFields = (produto) => {
        document.getElementById('id').value = produto.id
        document.getElementById('produto').value = produto.produto
        document.getElementById('preco').value = produto.preco
        document.getElementById('descricao').value = produto.descricao
        document.getElementById('imagem').value = produto.imagem
        document.getElementById('id').dataset.index = produto.index
    }

    const editProduto = (index) => {
        const produto = readProduto()[index]
        produto.index = index
        fillFields(produto)
        document.querySelector(".modal-header>h2").textContent  = `Editando produto ${produto.id}`
        openModal()
    }

    const editDelete = (event) => {
        if (event.target.type == 'button') {

            const [action, index] = event.target.id.split('-')

            if (action == 'edit') {
                editProduto(index)
            } else {
                const produto = readProduto()[index]
                const response = confirm(`Deseja realmente excluir o produto ${produto.id}`)
                if (response) {
                    deleteProduto(index)
                    updateTable()
                }
            }
        }
    }

    updateTable()

    // Eventos
    document.getElementById('cadastrarProduto')
        .addEventListener('click', openModal)

    document.getElementById('modalClose')
        .addEventListener('click', closeModal)

    document.getElementById('salvar')
        .addEventListener('click', saveProduto)

    document.querySelector('#tableProduto>tbody')
        .addEventListener('click', editDelete)

    document.getElementById('')
        .addEventListener('click', closeModal)

        const menuIcon = document.querySelector(".menu-icon");
        const menu = document.querySelector(".menu");
        
        menuIcon.addEventListener("click", () => {
        menu.classList.toggle("show");
        });
