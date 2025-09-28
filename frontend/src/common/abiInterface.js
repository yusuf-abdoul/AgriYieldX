import { ethers } from "ethers";
import { agriYieldAbi } from "../assets/agriYieldAbi";
import { farmSharesAbi } from "../assets/farmSharesAbi";
import { marketPlaceAbi } from "../assets/marketPlaceAbi";

export const agriYieldAbiInterface = new ethers.Interface(agriYieldAbi);
export const farmSharesAbiInterface = new ethers.Interface(farmSharesAbi);
export const marketPlaceAbiInterface = new ethers.Interface(marketPlaceAbi);
