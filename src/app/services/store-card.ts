const getStoreCard = (walletType: string, userId: string, token: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/store-card/${walletType}?userId=${userId}`;

    if (walletType === 'apple') {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.blob();
        }).then(blob => {
            const filename = 'wallet.pkpass'
            const type = 'application/vnd.apple.pkpass'
            const file = new File([blob], filename, { type: type })
            const reader = new FileReader()
            reader.onload = () => {
                const bdata = btoa(reader.result as string)
                const datauri = `data:${type};base64,${bdata}`;
                window.location.href = datauri;
            };
            reader.readAsDataURL(file);
        }).catch(error => {
            console.error(error)
        })
    }
    else {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        }).then(jsonResponse => {
            const jwt = jsonResponse.jwt;
            if (!jwt) {
                throw new Error('Could not generate jwt')
            }
            window.location.href = `https://pay.google.com/gp/v/save/${jwt}`;
        }).catch(error => {
            console.error(error)
        })
    }
}

export default getStoreCard;