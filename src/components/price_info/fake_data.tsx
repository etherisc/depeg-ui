import { Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { loadPriceFeedHistory, setDepeggedAt, setNoUpdates, setProductState, setTriggeredAt } from "../../redux/slices/price";
import { DepegState } from "../../types/depeg_state";

export default function FakeData() {

    const dispatch = useDispatch();

    function loadFakeDataHealthy() {
        const fakeData = [
            { roundId: "36893488147419103935", price: "100062746", timestamp: 1668040163 - (86400 * 4.6)},
            { roundId: "36893488147419103936", price: "100162746", timestamp: 1668040019 - (86400 * 4.2)},
            { roundId: "36893488147419103937", price: "100062746", timestamp: 1668040019 - (86400 * 4)},
            { roundId: "36893488147419103938", price: "100162746", timestamp: 1668040019 - (86400 * 3.4)},
            { roundId: "36893488147419103939", price: "100062746", timestamp: 1668040019 - (86400 * 3)},
            { roundId: "36893488147419103940", price: "100092746", timestamp: 1668040019 - (86400 * 2.6)},
            { roundId: "36893488147419103941", price: "100162746", timestamp: 1668040019 - (86400 * 2)},
            { roundId: "36893488147419103942", price: "100262746", timestamp: 1668040019 - (86400 * 1.5)},
            { roundId: "36893488147419103943", price: "100162746", timestamp: 1668040019 - (86400 * 1)},
            { roundId: "36893488147419103944", price: "100062746", timestamp: 1668040019 - (86400 * 0.5)},
            { roundId: "36893488147419103945", price: "100162746", timestamp: 1668040019},
            { roundId: "36893488147419103946", price: "100093098", timestamp: 1668040163},
            { roundId: "36893488147419103947", price: "100372218", timestamp: 1668040379},
            { roundId: "36893488147419103948", price: "100120456", timestamp: 1668040487},
            { roundId: "36893488147419103949", price: "100444777", timestamp: 1668045803},
            { roundId: "36893488147419103950", price: "100101944", timestamp: 1668046043},
            { roundId: "36893488147419103951", price: "100400000", timestamp: 1668056339},
            { roundId: "36893488147419103952", price: "100106206", timestamp: 1668056375},
            { roundId: "36893488147419103953", price: "100428722", timestamp: 1668063815},
            { roundId: "36893488147419103954", price: "100175597", timestamp: 1668064739},
            { roundId: "36893488147419103955", price: "100674588", timestamp: 1668079607},
            { roundId: "36893488147419103956", price: "100252257", timestamp: 1668079667},
            { roundId: "36893488147419103957", price: "100536183", timestamp: 1668082019},
            { roundId: "36893488147419103958", price: "100860951", timestamp: 1668082967},
            { roundId: "36893488147419103959", price: "100590501", timestamp: 1668083051},
            { roundId: "36893488147419103960", price: "100858654", timestamp: 1668083699},
            { roundId: "36893488147419103961", price: "100576498", timestamp: 1668083807},
            { roundId: "36893488147419103962", price: "100863838", timestamp: 1668084623},
            { roundId: "36893488147419103963", price: "100603142", timestamp: 1668085127},
            { roundId: "36893488147419103964", price: "100318255", timestamp: 1668086447},
            { roundId: "36893488147419103965", price: "100657874", timestamp: 1668089507},
            { roundId: '36893488147419103966', price: "100236137", timestamp: 1668089543},
            { roundId: "36893488147419103967", price: "99983254", timestamp: 1668101663},
            { roundId: "36893488147419103968", price: "100358100", timestamp: 1668143087},
            { roundId: "36893488147419103969", price: "100102976", timestamp: 1668143567},
            { roundId: "36893488147419103970", price: "100030312", timestamp: 1668229979},
            { roundId: "36893488147419103971", price: "100041428", timestamp: 1668316415},
            { roundId: "36893488147419103972", price: "100028750", timestamp: 1668402839},
        ];

        dispatch(setNoUpdates(false));
        dispatch(loadPriceFeedHistory(fakeData));
        dispatch(setTriggeredAt(0));
        dispatch(setDepeggedAt(0));
        dispatch(setProductState(DepegState.Active));
        dispatch(setNoUpdates(true));
    }

    function loadFakeDataTriggered() {
        const fakeData = [
            { roundId: "36893488147419103935", price: "100062746", timestamp: 1668040163 - (86400 * 4.6)},
            { roundId: "36893488147419103936", price: "100162746", timestamp: 1668040019 - (86400 * 4.2)},
            { roundId: "36893488147419103937", price: "100062746", timestamp: 1668040019 - (86400 * 4)},
            { roundId: "36893488147419103938", price: "100162746", timestamp: 1668040019 - (86400 * 3.4)},
            { roundId: "36893488147419103939", price: "100062746", timestamp: 1668040019 - (86400 * 3)},
            { roundId: "36893488147419103940", price: "100092746", timestamp: 1668040019 - (86400 * 2.6)},
            { roundId: "36893488147419103941", price: "100162746", timestamp: 1668040019 - (86400 * 2)},
            { roundId: "36893488147419103942", price: "100262746", timestamp: 1668040019 - (86400 * 1.5)},
            { roundId: "36893488147419103943", price: "100162746", timestamp: 1668040019 - (86400 * 1)},
            { roundId: "36893488147419103944", price: "100062746", timestamp: 1668040019 - (86400 * 0.5)},
            { roundId: "36893488147419103945", price: "099862746", timestamp: 1668040019},
            { roundId: "36893488147419103946", price: "099793098", timestamp: 1668040163},
            { roundId: "36893488147419103947", price: "099172218", timestamp: 1668040379},
            { roundId: "36893488147419103948", price: "099120456", timestamp: 1668040487},
            { roundId: "36893488147419103949", price: "089144777", timestamp: 1668045803},
            { roundId: "36893488147419103950", price: "087101944", timestamp: 1668046043},
            { roundId: "36893488147419103951", price: "080000000", timestamp: 1668056339},
            { roundId: "36893488147419103952", price: "082006206", timestamp: 1668056375},
            { roundId: "36893488147419103953", price: "083028722", timestamp: 1668063815},
            { roundId: "36893488147419103954", price: "079075597", timestamp: 1668064739},
            { roundId: "36893488147419103955", price: "079974588", timestamp: 1668079607},
        ];

        dispatch(setNoUpdates(false));
        dispatch(loadPriceFeedHistory(fakeData));
        dispatch(setTriggeredAt(1668040379));
        dispatch(setDepeggedAt(0));
        dispatch(setProductState(DepegState.Paused));
        dispatch(setNoUpdates(true));
    }

    function loadFakeDataTriggeredAndRecovered() {
        const fakeData = [
            { roundId: "36893488147419103935", price: "100062746", timestamp: 1668040163 - (86400 * 4.6)},
            { roundId: "36893488147419103936", price: "100162746", timestamp: 1668040019 - (86400 * 4.2)},
            { roundId: "36893488147419103937", price: "100062746", timestamp: 1668040019 - (86400 * 4)},
            { roundId: "36893488147419103938", price: "100162746", timestamp: 1668040019 - (86400 * 3.4)},
            { roundId: "36893488147419103939", price: "100062746", timestamp: 1668040019 - (86400 * 3)},
            { roundId: "36893488147419103940", price: "100092746", timestamp: 1668040019 - (86400 * 2.6)},
            { roundId: "36893488147419103941", price: "100162746", timestamp: 1668040019 - (86400 * 2)},
            { roundId: "36893488147419103942", price: "100262746", timestamp: 1668040019 - (86400 * 1.5)},
            { roundId: "36893488147419103943", price: "100162746", timestamp: 1668040019 - (86400 * 1)},
            { roundId: "36893488147419103944", price: "100062746", timestamp: 1668040019 - (86400 * 0.5)},
            { roundId: "36893488147419103945", price: "099862746", timestamp: 1668040019},
            { roundId: "36893488147419103946", price: "099793098", timestamp: 1668040163},
            { roundId: "36893488147419103947", price: "099172218", timestamp: 1668040379},
            { roundId: "36893488147419103948", price: "099120456", timestamp: 1668040487},
            { roundId: "36893488147419103949", price: "089144777", timestamp: 1668045803},
            { roundId: "36893488147419103950", price: "087101944", timestamp: 1668046043},
            { roundId: "36893488147419103951", price: "080000000", timestamp: 1668056339},
            { roundId: "36893488147419103952", price: "082006206", timestamp: 1668056375},
            { roundId: "36893488147419103953", price: "083028722", timestamp: 1668063815},
            { roundId: "36893488147419103954", price: "079075597", timestamp: 1668064739},
            { roundId: "36893488147419103955", price: "079974588", timestamp: 1668079607},
            { roundId: "36893488147419103956", price: "090252257", timestamp: 1668079667},
            { roundId: "36893488147419103957", price: "100536183", timestamp: 1668082019},
            { roundId: "36893488147419103958", price: "100860951", timestamp: 1668082967},
            { roundId: "36893488147419103959", price: "100590501", timestamp: 1668083051},
            { roundId: "36893488147419103960", price: "100858654", timestamp: 1668083699},
            { roundId: "36893488147419103961", price: "100576498", timestamp: 1668083807},
            { roundId: "36893488147419103962", price: "100863838", timestamp: 1668084623},
            { roundId: "36893488147419103963", price: "100603142", timestamp: 1668085127},
            { roundId: "36893488147419103964", price: "100318255", timestamp: 1668086447},
            { roundId: "36893488147419103965", price: "100657874", timestamp: 1668089507},
            { roundId: '36893488147419103966', price: "100236137", timestamp: 1668089543},
            { roundId: "36893488147419103967", price: "99983254", timestamp: 1668101663},
            { roundId: "36893488147419103968", price: "100358100", timestamp: 1668143087},
            { roundId: "36893488147419103969", price: "100102976", timestamp: 1668143567},
            { roundId: "36893488147419103970", price: "100030312", timestamp: 1668229979},
            { roundId: "36893488147419103971", price: "100041428", timestamp: 1668316415},
            { roundId: "36893488147419103972", price: "100028750", timestamp: 1668402839},
        ];

        dispatch(setNoUpdates(false));
        dispatch(loadPriceFeedHistory(fakeData));
        dispatch(setTriggeredAt(0));
        dispatch(setDepeggedAt(0));
        dispatch(setProductState(DepegState.Active));
        dispatch(setNoUpdates(true));
    }

    function loadFakeDataDepegged() {
        const fakeData = [
            { roundId: "36893488147419103935", price: "100062746", timestamp: 1668040163 - (86400 * 4.6)},
            { roundId: "36893488147419103936", price: "100162746", timestamp: 1668040019 - (86400 * 4.2)},
            { roundId: "36893488147419103937", price: "100062746", timestamp: 1668040019 - (86400 * 4)},
            { roundId: "36893488147419103938", price: "100162746", timestamp: 1668040019 - (86400 * 3.4)},
            { roundId: "36893488147419103939", price: "100062746", timestamp: 1668040019 - (86400 * 3)},
            { roundId: "36893488147419103940", price: "100092746", timestamp: 1668040019 - (86400 * 2.6)},
            { roundId: "36893488147419103941", price: "100162746", timestamp: 1668040019 - (86400 * 2)},
            { roundId: "36893488147419103942", price: "100262746", timestamp: 1668040019 - (86400 * 1.5)},
            { roundId: "36893488147419103943", price: "100162746", timestamp: 1668040019 - (86400 * 1)},
            { roundId: "36893488147419103944", price: "100062746", timestamp: 1668040019 - (86400 * 0.5)},
            { roundId: "36893488147419103945", price: "099862746", timestamp: 1668040019},
            { roundId: "36893488147419103946", price: "099793098", timestamp: 1668040163},
            { roundId: "36893488147419103947", price: "099172218", timestamp: 1668040379},
            { roundId: "36893488147419103948", price: "099120456", timestamp: 1668040487},
            { roundId: "36893488147419103949", price: "089144777", timestamp: 1668045803},
            { roundId: "36893488147419103950", price: "087101944", timestamp: 1668046043},
            { roundId: "36893488147419103951", price: "080000000", timestamp: 1668056339},
            { roundId: "36893488147419103952", price: "082006206", timestamp: 1668056375},
            { roundId: "36893488147419103953", price: "083028722", timestamp: 1668063815},
            { roundId: "36893488147419103954", price: "079075597", timestamp: 1668064739},
            { roundId: "36893488147419103955", price: "079974588", timestamp: 1668079607},
            { roundId: "36893488147419103956", price: "090252257", timestamp: 1668079667},
            { roundId: "36893488147419103957", price: "088131223", timestamp: 1668082019},
            { roundId: "36893488147419103958", price: "088412345", timestamp: 1668082967},
            { roundId: "36893488147419103959", price: "085234134", timestamp: 1668083051},
            { roundId: "36893488147419103960", price: "083423524", timestamp: 1668083699},
            { roundId: "36893488147419103961", price: "083423524", timestamp: 1668083807},
            { roundId: "36893488147419103962", price: "083423524", timestamp: 1668084623},
            { roundId: "36893488147419103963", price: "083423524", timestamp: 1668085127},
            { roundId: "36893488147419103964", price: "083423524", timestamp: 1668086447},
            { roundId: "36893488147419103965", price: "083423524", timestamp: 1668089507},
            { roundId: '36893488147419103966', price: "083423524", timestamp: 1668089543},
            { roundId: "36893488147419103967", price: "083423524", timestamp: 1668101663},
            { roundId: "36893488147419103968", price: "080342354", timestamp: 1668143087},
            { roundId: "36893488147419103969", price: "080623524", timestamp: 1668194567},
            { roundId: "36893488147419103970", price: "080123524", timestamp: 1668229979},
            { roundId: "36893488147419103971", price: "080423524", timestamp: 1668316415},
            { roundId: "36893488147419103972", price: "080123524", timestamp: 1668402839},
        ];

        dispatch(setNoUpdates(false));
        dispatch(loadPriceFeedHistory(fakeData));
        dispatch(setTriggeredAt(1668040379));
        dispatch(setDepeggedAt(1668143087));
        dispatch(setProductState(DepegState.Depegged));
        dispatch(setNoUpdates(true));
    }


    return (<Box sx={{ mt: 2 }}>
        <Button onClick={loadFakeDataHealthy}>Load healthy data</Button>
        <Button onClick={loadFakeDataTriggered}>Load triggered</Button>
        <Button onClick={loadFakeDataTriggeredAndRecovered}>Load triggered and recovered data</Button>
        <Button onClick={loadFakeDataDepegged}>Load triggered and depegged data</Button>
    </Box>);
}